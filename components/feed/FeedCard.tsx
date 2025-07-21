"use client"
import { FC } from "react"
import { Box, Text } from "@chakra-ui/react"
import { FeedPost } from "@/lib/types/feed"
import Image from "next/image"

type Props = {
  post: FeedPost
}

const FeedCard: FC<Props> = ({ post }) => {
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
    </Box>
  )
}

export default FeedCard
