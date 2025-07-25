import axios, { AxiosInstance } from "axios"

const axiosApiCall: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

axiosApiCall.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      config.headers["Authorization"] = authToken
    }
  }
  return config
})

export default axiosApiCall
