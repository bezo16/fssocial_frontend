import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import { Notification } from "../../types/notification"

export function useNotifications(userId: string) {
  return useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data } = await axiosApiCall.get(`/notifications/${userId}`)
      return data
    },
    enabled: !!userId,
  })
}

export function useMarkNotificationRead(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosApiCall.patch(`/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] })
    },
  })
}
