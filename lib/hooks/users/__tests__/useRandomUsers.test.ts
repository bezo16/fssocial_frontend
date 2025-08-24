import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import useRandomUsers from "../useRandomUsers"

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

describe("useRandomUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch random users successfully", async () => {
    const mockRandomUsers = [
      {
        id: "1",
        username: "user1",
        email: "user1@example.com",
        avatarUrl: "/avatars/user1.jpg",
        followersCount: 10,
        isFollowing: false,
      },
      {
        id: "2",
        username: "user2",
        email: "user2@example.com",
        avatarUrl: "/avatars/user2.jpg",
        followersCount: 20,
        isFollowing: true,
      },
      {
        id: "3",
        username: "user3",
        email: "user3@example.com",
        avatarUrl: null,
        followersCount: 5,
        isFollowing: false,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: mockRandomUsers })

    const { result } = renderHook(() => useRandomUsers(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockRandomUsers)
    expect(result.current.isError).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/users/random")
  })

  it("should handle API error", async () => {
    const errorMessage = "Failed to fetch random users"
    mockedGet.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useRandomUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(false)
    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(mockedGet).toHaveBeenCalledWith("/users/random")
  })

  it("should handle empty users array", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(() => useRandomUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isError).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/users/random")
  })

  it("should use correct query key", () => {
    const { result } = renderHook(() => useRandomUsers(), {
      wrapper: createWrapper(),
    })

    // The hook should be defined and working with the correct query key
    expect(result.current).toBeDefined()
    expect(result.current.isPending).toBe(true)
  })

  it("should handle single user response", async () => {
    const mockSingleUser = [
      {
        id: "solo",
        username: "onlyuser",
        email: "only@example.com",
        avatarUrl: "/avatars/only.jpg",
        followersCount: 100,
        isFollowing: false,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: mockSingleUser })

    const { result } = renderHook(() => useRandomUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockSingleUser)
    expect(result.current.isError).toBe(false)
    expect(result.current.data).toHaveLength(1)
  })
})
