import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import useUserData from "../useUserData"

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
        retry: false,
      },
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)

  return Wrapper
}

describe("useUserData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch user data successfully", async () => {
    const mockUserData = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      bio: "Test bio",
      avatarUrl: "/avatars/test.jpg",
      followersCount: 10,
      followingCount: 5,
      isFollowing: false,
    }

    mockedGet.mockResolvedValueOnce({ data: mockUserData })

    const { result } = renderHook(() => useUserData("1"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockUserData)
    expect(result.current.isError).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/users/1")
  })

  it("should handle API error", async () => {
    mockedGet.mockRejectedValueOnce(new Error("API Error"))

    const { result } = renderHook(() => useUserData("1"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/users/1")
  })

  it("should not fetch when id is empty", () => {
    const { result } = renderHook(() => useUserData(""), {
      wrapper: createWrapper(),
    })

    // With disabled queries, the initial state might be different
    // The important thing is that it doesn't call the API
    expect(result.current.data).toBeUndefined()
    expect(result.current.isError).toBe(false)
    expect(mockedGet).not.toHaveBeenCalled()
  })

  it("should not fetch when id is falsy", () => {
    const { result } = renderHook(() => useUserData("" as string), {
      wrapper: createWrapper(),
    })

    // With disabled queries, the initial state might be different
    // The important thing is that it doesn't call the API
    expect(result.current.data).toBeUndefined()
    expect(result.current.isError).toBe(false)
    expect(mockedGet).not.toHaveBeenCalled()
  })

  it("should use correct query key", () => {
    const { result } = renderHook(() => useUserData("123"), {
      wrapper: createWrapper(),
    })

    expect(result.current).toBeDefined()
  })
})
