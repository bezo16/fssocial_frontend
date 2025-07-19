import axios, { AxiosInstance } from "axios"

const axiosApiCall: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export default axiosApiCall
