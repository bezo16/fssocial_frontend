import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "@/lib/api/axiosApiCall"
import type { UserPreviewDto } from "@/lib/types/user"

const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["searchUsers", query],
    queryFn: async () => {
      const response = await axiosApiCall.get<UserPreviewDto[]>(`/users/feed/search?q=${query}`)
      return response.data
    },
    enabled: !!query,
  })
}
export default useSearchUsers
