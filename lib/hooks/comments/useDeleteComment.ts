import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toaster } from "@/components/ui/toaster"
import axiosApiCall from "@/lib/api/axiosApiCall"

const useDeleteComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await axiosApiCall.delete(`/comments/${commentId}`)
      return response.data
    },
    onError: (error) => {
      toaster.error({ title: "Error when deleting comment", description: error.message })
    },
    onSuccess: () => {
      toaster.success({ title: "Comment deleted" })
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] })
    },
  })
}

export default useDeleteComment
