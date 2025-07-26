import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { UserProfileDto } from "@/lib/types/user"

const useUserDataMe = () => {
  return useQuery<UserProfileDto>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const { data } = await axiosApiCall.get<UserProfileDto>(`/users/me`)
      return data
    },
  })
}

export default useUserDataMe
