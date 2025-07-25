import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"

const useLikePost = (postId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await axiosApiCall.post("/likes", {
        targetType: "post",
        targetId: postId,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] })
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
    },
  })
}

export default useLikePost
