"use client"
import { FC, useState } from "react"
import { Box, Text, IconButton } from "@chakra-ui/react"
import Link from "next/link"
import { FeedPost } from "@/lib/types/feed"
import Image from "next/image"
import { FaHeart } from "react-icons/fa"
import useLikePost from "@/lib/hooks/likes/useLikePost"
import useUnlikePost from "@/lib/hooks/likes/useUnlikePost"
import { useForm } from "react-hook-form"
import TextInput from "@/components/common/TextInput"
import BaseButton from "@/components/common/BaseButton"
import useCreateComment from "@/lib/hooks/comments/useCreateComment"
type CommentFormInputs = {
  content: string
}

type Props = {
  post: FeedPost
}

const FeedCard: FC<Props> = ({ post }) => {
  const { mutateAsync: likePost } = useLikePost(post.post.id)
  const { mutateAsync: unlikePost } = useUnlikePost(post.post.id)
  const { mutateAsync: createComment } = useCreateComment()
  const [showCommentForm, setShowCommentForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CommentFormInputs>()

  const handleLike = async (action: "LIKE" | "UNLIKE") => {
    await (action === "LIKE" ? likePost() : unlikePost())
  }

  const handleAddComment = async (data: CommentFormInputs) => {
    await createComment({ content: data.content, targetType: "post", targetId: post.post.id })
    reset()
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
      bg="white"
      _hover={{ boxShadow: "lg" }}
    >
      <Box display="flex" alignItems="center" mb={3} gap={3}>
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          {post.author.username}
        </Text>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            aria-label={post.post ? "Unlike" : "Like"}
            variant="ghost"
            size="lg"
            onClick={() => handleLike(post.likes.isLiked ? "UNLIKE" : "LIKE")}
            _hover={{ bg: "transparent" }}
          >
            <FaHeart color={post.likes.isLiked ? "#E53E3E" : "#A0AEC0"} />
          </IconButton>
          <Text fontSize="lg" color="gray.700" minW={6} textAlign="center">
            {post.likes.count}
          </Text>
        </Box>
      </Box>
      <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
        {post.post.title}
      </Text>
      <Text fontSize="md" color="gray.600" mb={3}>
        {post.post.content}
      </Text>
      {post.post.imageUrl && (
        <Box
          mt={2}
          borderRadius="lg"
          overflow="hidden"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={post.post.imageUrl}
            alt={post.post.title}
            width={300}
            height={300}
            style={{ objectFit: "cover" }}
          />
        </Box>
      )}
      {/* Komentáre */}
      {Array.isArray(post.comments) && post.comments.length > 0 && (
        <Box mt={4}>
          <Text fontWeight="bold" mb={2} color="gray.700">Komentáre</Text>
          <Box display="flex" flexDirection="column" gap={2}>
            {post.comments.map(comment => (
              <Box key={comment.id} p={2} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.800">{comment.content}</Text>
                <Text as="span" fontSize="xs" color="blue.600" fontWeight="bold" letterSpacing="wide">
                  <Link
                    href={`/profile/${comment.author.id}`}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    @
                    {comment.author.username}
                  </Link>
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box mt={4}>
        <BaseButton
          label={showCommentForm ? "Zrušiť" : "Pridať komentár"}
          onClick={() => setShowCommentForm(v => !v)}
          className="mb-2"
          type="button"
        />
        {showCommentForm && (
          <Box>
            <form onSubmit={handleSubmit(handleAddComment)}>
              <TextInput
                label="Komentár"
                errorText={errors.content?.message}
                {...register("content", { required: "Komentár je povinný" })}
                type="text"
              />
              <BaseButton
                label="Odoslať"
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="mt-2"
              />
            </form>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default FeedCard
