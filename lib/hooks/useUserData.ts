import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { UserDto } from "../types/user"

export const useUserData = (id: string) => {
  return useQuery<UserDto>({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await axiosApiCall.get<UserDto>(`/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}
