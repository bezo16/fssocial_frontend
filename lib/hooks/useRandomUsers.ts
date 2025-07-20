import { useQuery } from "@tanstack/react-query"
import { UserDto } from "../types/user"
import axiosApiCall from "../api/axiosApiCall"

const useRandomUsers = () => {
  return useQuery({
    queryKey: ["randomUsers"],
    queryFn: async () => {
      const response = await axiosApiCall.get<UserDto[]>(`/users/random`)
      return response.data
    },
  })
}

export default useRandomUsers
