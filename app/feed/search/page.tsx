"use client"
import useSearchUsers from "@/lib/hooks/useSearchUsers"
import { useSearchParams } from "next/navigation"
import { Box, Heading, Text, Flex, Input, Button } from "@chakra-ui/react"
import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"

const SearchFeedPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [input, setInput] = useState(query)
  const { data: users } = useSearchUsers(query)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/feed/search?q=${encodeURIComponent(input)}`)
  }

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" bg="gray.50" px={4}>
      <Box w="full" maxW="2xl" mt={10}>
        <Heading as="h1" size="xl" mb={4} textAlign="center" color="blue.700">
          Search Feed
        </Heading>
        <Box as="form" onSubmit={handleSearch} display="flex" gap={2} mb={6} justifyContent="center">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search users..."
            size="md"
            maxW="sm"
            bg="white"
          />
          <Button type="submit" colorScheme="blue" fontWeight="bold">
            Search
          </Button>
        </Box>
        <Text color="gray.600" textAlign="center" mb={6}>
          Search Query:
          {" "}
          <Text as="span" color="blue.500" fontWeight="bold">
            {query || "No query provided"}
          </Text>
        </Text>
        {users && users.length > 0
          ? (
              <Box>
                {users.map(user => (
                  <Link key={user.id} href={`/profile/${user.id}`} passHref legacyBehavior>
                    <Box
                      as="a"
                      mb={4}
                      display="block"
                      p={5}
                      bg="white"
                      borderRadius="lg"
                      boxShadow="md"
                      _hover={{ boxShadow: "xl", transform: "translateY(-2px) scale(1.01)", textDecoration: "none" }}
                      transition="all 0.2s"
                    >
                      <Heading as="h2" size="md" color="blue.700">{user.username}</Heading>
                      <Text color="gray.500" fontSize="md">
                        @
                        {user.username}
                      </Text>
                    </Box>
                  </Link>
                ))}
              </Box>
            )
          : (
              <Text color="gray.500" textAlign="center">No users found.</Text>
            )}
      </Box>
    </Flex>
  )
}

export default SearchFeedPage
