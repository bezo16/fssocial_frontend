import { Box, Text } from "@chakra-ui/react"
import useUserDataMe from "@/lib/hooks/users/useUserDataMe"
import ProfilePicture from "../common/ProfilePicture"

const ProfileAvatarSection = () => {
  const { data: user } = useUserDataMe()
  if (!user) return null
  return (
    <Box mb={6} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <ProfilePicture avatarUrl={user.avatarUrl as string} username={user.username} />
      <Text fontWeight="bold" fontSize="lg" color="gray.700" mt={2}>{user.username}</Text>
      {user.bio && (
        <Text fontSize="md" color="gray.500" mt={1}>{user.bio}</Text>
      )}
    </Box>
  )
}

export default ProfileAvatarSection
