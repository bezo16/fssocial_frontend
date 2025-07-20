import { useQuery } from "@tanstack/react-query"
import axiosApiCall from "../api/axiosApiCall"
import { UserDto } from "../types/user"

const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["searchUsers", query],
    queryFn: async () => {
      const response = await axiosApiCall.get<UserDto[]>(`/users/feed/search?q=${query}`)
      return response.data
    },
    enabled: !!query,
  })
}
export default useSearchUsers
