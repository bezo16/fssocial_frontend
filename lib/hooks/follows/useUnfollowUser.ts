import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"

export const useUnfollowUser = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string) => {
      await axiosApiCall.delete("follows", {
        data: {
          followingId: userId,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
    },
  })
}
