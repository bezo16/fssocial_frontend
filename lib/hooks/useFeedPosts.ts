import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "../api/axiosApiCall"
import { FeedPost } from "../types/feed"

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
