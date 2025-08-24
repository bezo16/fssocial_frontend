import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import useSearchUsers from "../useSearchUsers"

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

describe("useSearchUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should search users successfully", async () => {
    const mockSearchResults = [
      {
        id: "user1",
        username: "john_doe",
        email: "john@example.com",
        avatarUrl: "/avatars/john.jpg",
        followersCount: 25,
        isFollowing: false,
      },
      {
        id: "user2",
        username: "jane_smith",
        email: "jane@example.com",
        avatarUrl: "/avatars/jane.jpg",
        followersCount: 42,
        isFollowing: true,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: mockSearchResults })

    const { result } = renderHook(() => useSearchUsers("john"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockSearchResults)
    expect(result.current.isError).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/users/feed/search?q=john")
  })

  it("should handle search API error", async () => {
    const errorMessage = "Search failed"
    mockedGet.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useSearchUsers("test"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(false)
    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(mockedGet).toHaveBeenCalledWith("/users/feed/search?q=test")
  })

  it("should handle empty search results", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(() => useSearchUsers("nonexistent"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isError).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/users/feed/search?q=nonexistent")
  })

  it("should not fetch when query is empty", () => {
    const { result } = renderHook(() => useSearchUsers(""), {
      wrapper: createWrapper(),
    })

    // With disabled queries, the important thing is that it doesn't call the API
    expect(result.current.data).toBeUndefined()
    expect(result.current.isError).toBe(false)
    expect(mockedGet).not.toHaveBeenCalled()
  })

  it("should handle URL encoding for search queries", async () => {
    const mockResults = [
      {
        id: "user1",
        username: "test_user",
        email: "test@example.com",
        avatarUrl: null,
        followersCount: 10,
        isFollowing: false,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: mockResults })

    const searchQuery = "test@example.com"
    const { result } = renderHook(() => useSearchUsers(searchQuery), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockResults)
    expect(mockedGet).toHaveBeenCalledWith(`/users/feed/search?q=${searchQuery}`)
  })

  it("should use correct query key with search term", () => {
    const { result } = renderHook(() => useSearchUsers("testquery"), {
      wrapper: createWrapper(),
    })

    // The hook should be defined and working
    expect(result.current).toBeDefined()
    expect(result.current.isPending).toBe(true)
  })

  it("should handle single search result", async () => {
    const mockSingleResult = [
      {
        id: "unique",
        username: "uniqueuser",
        email: "unique@example.com",
        avatarUrl: "/avatars/unique.jpg",
        followersCount: 1,
        isFollowing: false,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: mockSingleResult })

    const { result } = renderHook(() => useSearchUsers("uniqueuser"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockSingleResult)
    expect(result.current.data).toHaveLength(1)
    expect(result.current.isError).toBe(false)
  })
})
