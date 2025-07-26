"use client"
import { FC } from "react"
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
import useDeleteComment from "@/lib/hooks/comments/useDeleteComment"
import useUserDataMe from "@/lib/hooks/users/useUserDataMe"
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
  const { mutateAsync: deleteComment } = useDeleteComment()
  const { data: userData } = useUserDataMe()
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
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="xl"
      p="24px !important"
      bg="white"
      _hover={{ boxShadow: "2xl" }}
      m="24px !important"
      style={{ transition: "box-shadow 0.2s", marginBottom: "32px !important", marginTop: "16px !important" }}
    >
      <Box display="flex" alignItems="center" mb="10px !important" gap={1} px="2px !important" style={{ minHeight: "40px" }}>
        <Link
          href={`/profile/${post.author.id}`}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.700" letterSpacing="wide" mb="2px !important" pr="12px !important">
            {post.author.username}
          </Text>
        </Link>
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label={post.post ? "Unlike" : "Like"}
            variant="ghost"
            size="lg"
            onClick={() => handleLike(post.likes.isLiked ? "UNLIKE" : "LIKE")}
            _hover={{ bg: "transparent" }}
          >
            <FaHeart color={post.likes.isLiked ? "#E53E3E" : "#A0AEC0"} />
          </IconButton>
          <Text fontSize="lg" color="gray.700" minW={6} textAlign="center" ml="0 !important">
            {post.likes.count}
          </Text>
        </Box>
      </Box>
      <Text fontSize="xl" fontWeight="extrabold" color="gray.800" mb="10px !important" letterSpacing="wide">
        {post.post.title}
      </Text>
      <Text fontSize="md" color="gray.600" mb="18px !important" lineHeight={1.7}>
        {post.post.content}
      </Text>
      {post.post.imageUrl && (
        <Box
          mt="12px !important"
          borderRadius="2xl"
          overflow="hidden"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="md"
          p="8px !important"
        >
          <Image
            src={post.post.imageUrl}
            alt={post.post.title}
            width={320}
            height={320}
            style={{ objectFit: "cover", borderRadius: "16px" }}
          />
        </Box>
      )}
      {/* Komentáre */}
      {Array.isArray(post.comments) && post.comments.length > 0 && (
        <Box mt="24px !important">
          <Text fontWeight="bold" mb="10px !important" color="gray.700" fontSize="md" letterSpacing="wide">Komentáre</Text>
          <Box display="flex" flexDirection="column" gap={3}>
            {post.comments.map(comment => (
              <Box key={comment.id} p="14px !important" bg="gray.50" borderRadius="lg" display="flex" alignItems="center" justifyContent="space-between" boxShadow="sm" mb="2px !important">
                <Box>
                  <Text fontSize="md" color="gray.800" mb="2px !important">{comment.content}</Text>
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
                {userData?.id === comment.author.id && (
                  <BaseButton
                    label="Odstrániť"
                    size="xs"
                    colorScheme="red"
                    variant="outline"
                    onClick={async () => await deleteComment(comment.id)}
                    className="ml-2"
                    style={{ fontSize: "12px", padding: "2px 8px !important", borderRadius: "8px !important" }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box mt="32px !important">
        <Box
          borderWidth="1px"
          borderRadius="xl"
          boxShadow="sm"
          p="18px !important"
          bg="gray.50"
          mt="8px !important"
          mb="8px !important"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap={3}
        >
          <form style={{ width: "100%" }} onSubmit={handleSubmit(handleAddComment)}>
            <TextInput
              label="Napíš komentár"
              errorText={errors.content?.message}
              {...register("content", { required: "Komentár je povinný" })}
              type="text"
              placeholder="Zdieľaj svoj názor..."
              style={{ padding: "12px !important", borderRadius: "8px !important", fontSize: "16px" }}
            />
            <BaseButton
              label="Odoslať komentár"
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="mt-3"
              style={{ width: "100%", fontWeight: "bold", fontSize: "15px", background: "#3182ce", color: "white" }}
              _hover={{ background: "#2563eb !important" }}
            />
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default FeedCard
