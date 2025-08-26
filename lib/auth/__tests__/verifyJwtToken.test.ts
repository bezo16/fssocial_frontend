import { describe, it, expect, vi, beforeEach } from "vitest"
import verifyJwtToken from "../verifyJwtToken"

// Mock the axiosApiCall module
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    post: vi.fn(),
  },
}))

// Import the mocked version
const { default: axiosApiCall } = await import("@/lib/api/axiosApiCall")
const mockedPost = vi.mocked(axiosApiCall.post)

describe("verifyJwtToken", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return valid true when token is valid", async () => {
    const mockToken = "valid-jwt-token"
    const mockResponse = {
      data: {
        valid: true,
        decoded: { userId: "123", username: "testuser" },
      },
    }

    mockedPost.mockResolvedValue(mockResponse)

    const result = await verifyJwtToken(mockToken)

    expect(result.valid).toBe(true)
    expect(result.decoded).toEqual({ userId: "123", username: "testuser" })
    expect(mockedPost).toHaveBeenCalledWith(
      "/auth/jwt",
      { token: mockToken },
      { withCredentials: true },
    )
  })

  it("should return valid false when token is invalid", async () => {
    const mockToken = "invalid-jwt-token"
    const mockResponse = {
      data: {
        valid: false,
        decoded: null,
      },
    }

    mockedPost.mockResolvedValue(mockResponse)

    const result = await verifyJwtToken(mockToken)

    expect(result.valid).toBe(false)
    expect(result.decoded).toBe(null)
  })

  it("should throw error when API call fails", async () => {
    const mockToken = "test-token"
    const mockError = new Error("Network error")

    mockedPost.mockRejectedValue(mockError)

    await expect(verifyJwtToken(mockToken)).rejects.toThrow("Invalid token")
    expect(mockedPost).toHaveBeenCalledWith(
      "/auth/jwt",
      { token: mockToken },
      { withCredentials: true },
    )
  })

  it("should handle empty token", async () => {
    const mockToken = ""
    const mockResponse = {
      data: {
        valid: false,
        decoded: null,
      },
    }

    mockedPost.mockResolvedValue(mockResponse)

    const result = await verifyJwtToken(mockToken)

    expect(result.valid).toBe(false)
    expect(result.decoded).toBe(null)
    expect(mockedPost).toHaveBeenCalledWith(
      "/auth/jwt",
      { token: mockToken },
      { withCredentials: true },
    )
  })

  it("should call API with correct configuration", async () => {
    const mockToken = "test-token"
    mockedPost.mockResolvedValue({
      data: { valid: true, decoded: {} },
    })

    await verifyJwtToken(mockToken)

    expect(mockedPost).toHaveBeenCalledWith(
      "/auth/jwt",
      { token: mockToken },
      { withCredentials: true },
    )
  })
})
