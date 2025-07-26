import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { UserPreviewDto } from "@/lib/types/user"

const useRandomUsers = () => {
  return useQuery({
    queryKey: ["randomUsers"],
    queryFn: async () => {
      const response = await axiosApiCall.get<UserPreviewDto []>(`/users/random`)
      return response.data
    },
  })
}

export default useRandomUsers
