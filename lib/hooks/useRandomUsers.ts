import { useQuery } from "@tanstack/react-query"
import { UserPreviewDto } from "../types/user"
import axiosApiCall from "../api/axiosApiCall"

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
