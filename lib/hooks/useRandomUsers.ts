import { useQuery } from "@tanstack/react-query"
import { User } from "../types/user"
import axiosApiCall from "../api/axiosApiCall"

const useRandomUsers = () => {
  return useQuery({
    queryKey: ["randomUsers"],
    queryFn: async () => {
      const response = await axiosApiCall.get<User[]>(`/users/random`)
      return response.data
    },
  })
}

export default useRandomUsers
