import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { Post } from "@/lib/types/feed"

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
