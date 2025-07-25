import { useQuery } from "@tanstack/react-query"

import { Post } from "../types/feed"
import axiosApiCall from "../api/axiosApiCall"

const useProfilePostsMe = () => {
  return useQuery({
    queryKey: ["profilePostsMe"],
    queryFn: async () => {
      const response = await axiosApiCall.get<Post[]>("/posts/profile/me", {
        withCredentials: true,
      })
      return response.data
    },
  })
}

export default useProfilePostsMe
