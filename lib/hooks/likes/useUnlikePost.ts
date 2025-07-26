import { useMutation } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import { useQueryClient } from "@tanstack/react-query"

const useUnlikePost = (postId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await axiosApiCall.delete("/likes", {
        data: {
          targetType: "post",
          targetId: postId,
        },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] })
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
    },
  })
}

export default useUnlikePost
