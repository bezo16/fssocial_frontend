import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Post } from "../types/feed"

const useProfilePostsMe = () => {
  return useQuery({
    queryKey: ["profilePostsMe"],
    queryFn: async () => {
      const response = await axios.get<Post[]>(`${process.env.NEXT_PUBLIC_API_URL}/posts/profile/me`, {
        withCredentials: true,
      })
      return response.data
    },
  })
}

export default useProfilePostsMe
