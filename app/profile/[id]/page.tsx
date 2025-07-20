"use client"

import { Box, Heading, Text, Spinner, Flex } from "@chakra-ui/react"
import { useParams } from "next/navigation"
import { useUserData } from "@/lib/hooks/useUserData"
import BaseButton from "@/components/common/BaseButton"
import { useFollowUser } from "@/lib/hooks/useFollowUser"
import { useUnfollowUser } from "@/lib/hooks/useUnfollowUser"

const UserProfilePage = () => {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data: user, isLoading, isError, error } = useUserData(id)
  const { mutateAsync: followUser, isPending: isFollowing } = useFollowUser(user?.id)
  const { mutateAsync: unFollowUser, isPending: isUnfollowing } = useUnfollowUser(user?.id)

  if (isLoading) {
    return (
      <Flex align="center" justify="center" minH="60vh" bgGradient="linear(to-br, blue.50, purple.50)">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4} fontSize="lg" color="blue.700">Loading user data...</Text>
      </Flex>
    )
  }

  if (isError) {
    return (
      <Box mt={12} borderRadius="xl" bg="red.50" borderWidth={1} borderColor="red.200" p={6} color="red.800" maxW="sm" mx="auto" boxShadow="lg">
        <Text fontWeight="bold" fontSize="xl" mb={2}>Error loading user</Text>
        <Text>{error instanceof Error ? error.message : "Unknown error"}</Text>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box mt={12} borderRadius="xl" bg="yellow.50" borderWidth={1} borderColor="yellow.200" p={6} color="yellow.800" maxW="sm" mx="auto" boxShadow="lg">
        <Text fontWeight="bold" fontSize="xl">User not found</Text>
      </Box>
    )
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, blue.50, purple.50)">
      <Box maxW="lg" w="full" p={10} borderRadius="2xl" boxShadow="2xl" bg="white" borderWidth={0}>
        <Flex direction="column" align="center" mb={8}>
          <Box mb={4} borderRadius="full" bg="blue.400" w="80px" h="80px" display="flex" alignItems="center" justifyContent="center" fontSize="3xl" color="white" fontWeight="bold" boxShadow="md">
            {user.username.charAt(0).toUpperCase()}
          </Box>
          <Heading as="h1" size="xl" mb={1} color="blue.700" letterSpacing="tight">
            {user.username}
          </Heading>
          <Text color="gray.500" fontSize="md">
            @
            {user.username}
          </Text>
          {user.isFollowed
            ? (
                <BaseButton
                  label="Unfollow"
                  mt={4}
                  w="40%"
                  fontWeight="bold"
                  fontSize="md"
                  onClick={() => unFollowUser(user.id)}
                  disabled={isUnfollowing}
                />
              )
            : (
                <BaseButton
                  label="Follow"
                  mt={4}
                  w="40%"
                  fontWeight="bold"
                  fontSize="md"
                  onClick={() => followUser(user.id)}
                  disabled={isFollowing}
                />
              )}
          <Text mt={3} color="gray.700" fontWeight="semibold" fontSize="lg">
            Followers:
            <Text as="span" color="blue.500" fontWeight="bold">{user.followsCount}</Text>
          </Text>
        </Flex>
        <Box mb={6} borderBottomWidth={1} borderColor="gray.100" />
        <Box mb={4}>
          <Text fontWeight="bold" as="span" color="gray.700">User ID:</Text>
          <Text as="span" ml={1} color="gray.600">{user.id}</Text>
        </Box>
        <Box mb={4}>
          <Text fontWeight="bold" as="span" color="gray.700">Email:</Text>
          <Text as="span" ml={1} color="gray.600">{user.email}</Text>
        </Box>
        <Box mb={4}>
          <Text fontWeight="bold" as="span" color="gray.700">Created at:</Text>
          <Text as="span" ml={1} color="gray.600">{new Date(user.created_at).toLocaleString()}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold" as="span" color="gray.700">Updated at:</Text>
          <Text as="span" ml={1} color="gray.600">{new Date(user.updated_at).toLocaleString()}</Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default UserProfilePage
