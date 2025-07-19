import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { User } from "../types/user"

export const useUserData = (id: string) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await axiosApiCall.get<User>(`/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}
