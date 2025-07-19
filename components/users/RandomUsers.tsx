"use client"
import useRandomUsers from "@/lib/hooks/useRandomUsers"
import {
  Box,
  Heading,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react"
import { useRouter } from "next/navigation"

const RandomUsers = () => {
  const { data: users, isLoading, isError } = useRandomUsers()
  const router = useRouter()

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading as="h2" size="lg" mb={6} textAlign="center" color="blue.600">
        Random Users
      </Heading>
      {isLoading && (
        <Flex justify="center" align="center" minH="100px">
          <Spinner size="lg" color="blue.500" />
        </Flex>
      )}
      {isError && (
        <Box bg="red.50" border="1px solid" borderColor="red.200" color="red.700" borderRadius="md" p={3} mb={4} textAlign="center">
          Failed to load users.
        </Box>
      )}
      {!isLoading && !isError && (
        <Box as="ul" listStyleType="none" p={0} m={0}>
          {users?.length
            ? (
                users.map(user => (
                  <Box
                    as="li"
                    key={user.id}
                    mb={3}
                    className="cursor-pointer"
                    onClick={() => router.push(`/profile/${user.id}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <Box borderWidth="1px" borderRadius="md" borderColor="gray.200" p={4} boxShadow="sm" _hover={{ boxShadow: "md", bg: "gray.50" }}>
                      <Flex align="center" gap={4}>
                        <Box boxSize="40px" borderRadius="full" bg="blue.100" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" color="blue.700">
                          {user.username?.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="gray.700">{user.username}</Text>
                          {/* Add more user info here if available */}
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                ))
              )
            : (
                <Text color="gray.500" textAlign="center">No users found.</Text>
              )}
        </Box>
      )}
    </Box>
  )
}

export default RandomUsers
