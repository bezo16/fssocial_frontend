"use client"
import { Box, Flex, Link, Button, Spacer } from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

const NavigationBar = () => {
  const router = useRouter()

  const signOut = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/auth/login")
  }

  return (
    <Box bg="teal.500" px={8} w="100%" className="w-full">
      <Flex h={20} alignItems="center">
        <NextLink href="/">
          <Link color="white" fontWeight="bold" fontSize="lg">
            Social Platform
          </Link>
        </NextLink>
        <Spacer />
        <Flex alignItems="center">
          <NextLink href="/feed">
            <Link color="white" mx={4}>
              Feed
            </Link>
          </NextLink>
          <NextLink href="/profile/me">
            <Link color="white" mx={4}>
              Profile
            </Link>
          </NextLink>
          <Button colorScheme="teal" variant="outline" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default NavigationBar
