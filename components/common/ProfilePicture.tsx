import { AvatarFallback, AvatarImage, AvatarRoot } from "@chakra-ui/react"
import { FC } from "react"

const ProfilePicture: FC<{ avatarUrl: string, username: string }> = ({ avatarUrl, username }) => {
  return (
    <AvatarRoot size="2xl">
      <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}${avatarUrl}`} />
      <AvatarFallback name={username} />
    </AvatarRoot>
  )
}

export default ProfilePicture
