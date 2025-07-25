import axiosApiCall from "../api/axiosApiCall"

const verifyJwtToken = async (token: string) => {
  const returnValue: { valid: boolean, decoded: null | unknown } = { valid: false, decoded: null }

  try {
    const response = await axiosApiCall.post(
      "/auth/jwt",
      { token },
      { withCredentials: true },
    )
    returnValue.valid = response.data.valid
    returnValue.decoded = response.data.decoded
  }
  catch (error) {
    console.error("JWT verification failed:", error)
    throw new Error("Invalid token")
  }

  return returnValue
}

export default verifyJwtToken
