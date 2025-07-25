import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { UserProfileDto } from "@/lib/types/user"

const useUserData = (id: string) => {
  return useQuery<UserProfileDto>({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await axiosApiCall.get<UserProfileDto>(`/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export default useUserData
