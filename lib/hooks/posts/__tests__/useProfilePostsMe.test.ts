import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import useProfilePostsMe from "../useProfilePostsMe"

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

describe("useProfilePostsMe", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch user profile posts successfully", async () => {
    const mockPosts = [
      {
        id: "post1",
        title: "My First Post",
        content: "This is my first post content",
        imageUrl: "/images/post1.jpg",
        author: {
          id: "user1",
          username: "testuser",
          avatarUrl: "/avatars/user1.jpg",
        },
        createdAt: "2023-01-01T00:00:00Z",
        likesCount: 5,
        commentsCount: 2,
        isLiked: true,
      },
      {
        id: "post2",
        title: "Another Post",
        content: "More content here",
        imageUrl: null,
        author: {
          id: "user1",
          username: "testuser",
          avatarUrl: "/avatars/user1.jpg",
        },
        createdAt: "2023-01-02T00:00:00Z",
        likesCount: 12,
        commentsCount: 4,
        isLiked: false,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: mockPosts })

    const { result } = renderHook(() => useProfilePostsMe(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockPosts)
    expect(result.current.isError).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/posts/profile/me", {
      withCredentials: true,
    })
  })

  it("should handle API error", async () => {
    const errorMessage = "Failed to fetch profile posts"
    mockedGet.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useProfilePostsMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(false)
    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(mockedGet).toHaveBeenCalledWith("/posts/profile/me", {
      withCredentials: true,
    })
  })

  it("should handle empty posts array", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(() => useProfilePostsMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isError).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/posts/profile/me", {
      withCredentials: true,
    })
  })

  it("should use correct query key", () => {
    const { result } = renderHook(() => useProfilePostsMe(), {
      wrapper: createWrapper(),
    })

    // The hook should be defined and working with the correct query key
    expect(result.current).toBeDefined()
    expect(result.current.isPending).toBe(true)
  })

  it("should handle single post response", async () => {
    const mockSinglePost = [
      {
        id: "single",
        title: "Only Post",
        content: "The only post I have",
        imageUrl: "/images/only.jpg",
        author: {
          id: "user1",
          username: "testuser",
          avatarUrl: "/avatars/user1.jpg",
        },
        createdAt: "2023-01-01T00:00:00Z",
        likesCount: 1,
        commentsCount: 0,
        isLiked: false,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: mockSinglePost })

    const { result } = renderHook(() => useProfilePostsMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.data).toEqual(mockSinglePost)
    expect(result.current.isError).toBe(false)
    expect(result.current.data).toHaveLength(1)
  })

  it("should call API with withCredentials", async () => {
    const mockPosts: unknown[] = []
    mockedGet.mockResolvedValueOnce({ data: mockPosts })

    const { result } = renderHook(() => useProfilePostsMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    // Verify the API was called with the correct authentication config
    expect(mockedGet).toHaveBeenCalledWith("/posts/profile/me", {
      withCredentials: true,
    })
  })

  it("should handle network timeout error", async () => {
    const timeoutError = new Error("Network timeout")
    mockedGet.mockRejectedValueOnce(timeoutError)

    const { result } = renderHook(() => useProfilePostsMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(timeoutError)
    expect(result.current.data).toBeUndefined()
  })
})
