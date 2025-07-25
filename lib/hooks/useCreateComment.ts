import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toaster } from "@/components/ui/toaster"
import axiosApiCall from "../api/axiosApiCall"

const useCreateComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { targetType: string, targetId: string, content: string }) => {
      const response = await axiosApiCall.post(`/comments`, data)
      return response.data
    },
    onError: (error) => {
      toaster.error({ title: "Chyba pri pridávaní komentára", description: error.message })
    },
    onSuccess: () => {
      toaster.success({ title: "Komentár pridaný" })
      queryClient.invalidateQueries({ queryKey: ["feedPosts"] })
    },
  })
}

export default useCreateComment
