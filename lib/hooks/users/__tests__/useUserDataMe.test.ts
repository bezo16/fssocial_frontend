import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import useUserDataMe from "../useUserDataMe"

// Mock the axiosApiCall module
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    get: vi.fn(),
  },
}))

// Import the mocked version
const { default: axiosApiCall } = await import("@/lib/api/axiosApiCall")
const mockedGet = vi.mocked(axiosApiCall.get)

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
      },
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }

  return Wrapper
}

describe("useUserDataMe", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch user data successfully", async () => {
    const mockUserData = {
      id: "123",
      username: "testuser",
      email: "test@example.com",
      password_hash: "hashed",
      created_at: new Date(),
      updated_at: new Date(),
      followsCount: 5,
      isFollowed: false,
    }

    mockedGet.mockResolvedValue({ data: mockUserData })

    const { result } = renderHook(() => useUserDataMe(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUserData)
    expect(mockedGet).toHaveBeenCalledWith("/users/me")
  })

  it("should handle error state", async () => {
    const mockError = new Error("User not found")
    mockedGet.mockRejectedValue(mockError)

    const { result } = renderHook(() => useUserDataMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(mockError)
    expect(mockedGet).toHaveBeenCalledWith("/users/me")
  })

  it("should be initially loading", () => {
    const { result } = renderHook(() => useUserDataMe(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should call API only once per mount", async () => {
    mockedGet.mockResolvedValue({ data: {} })

    renderHook(() => useUserDataMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledTimes(1)
    })
  })
})
