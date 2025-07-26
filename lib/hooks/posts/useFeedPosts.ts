import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { FeedPost } from "@/lib/types/feed"

const useFeedPosts = () => {
  return useQuery({
    queryKey: ["feedPosts"],
    queryFn: async () => {
      const response = await axiosApiCall.get<FeedPost[]>("/posts/feed")
      return response.data
    },
  })
}
export default useFeedPosts
