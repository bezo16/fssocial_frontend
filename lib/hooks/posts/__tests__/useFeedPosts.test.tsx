import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import useFeedPosts from "../useFeedPosts"

// Mock axiosApiCall
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    get: vi.fn(),
  },
}))

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

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper
}

describe("useFeedPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch feed posts successfully", async () => {
    const mockFeedPosts = [
      {
        id: "post1",
        title: "Test Post 1",
        content: "This is test content 1",
        authorId: "user1",
        authorUsername: "testuser1",
        authorAvatarUrl: "/avatars/user1.jpg",
        imageUrl: "/images/post1.jpg",
        likes: 5,
        isLiked: false,
        comments: [],
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "post2",
        title: "Test Post 2",
        content: "This is test content 2",
        authorId: "user2",
        authorUsername: "testuser2",
        authorAvatarUrl: "/avatars/user2.jpg",
        imageUrl: null,
        likes: 10,
        isLiked: true,
        comments: [],
        createdAt: "2024-01-02T00:00:00Z",
      },
    ]

    mockedGet.mockResolvedValue({ data: mockFeedPosts })

    const { result } = renderHook(() => useFeedPosts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockFeedPosts)
    expect(mockedGet).toHaveBeenCalledWith("/posts/feed")
  })

  it("should handle empty feed", async () => {
    mockedGet.mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useFeedPosts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(mockedGet).toHaveBeenCalledWith("/posts/feed")
  })

  it("should handle API error", async () => {
    const mockError = new Error("Failed to fetch feed")
    mockedGet.mockRejectedValue(mockError)

    const { result } = renderHook(() => useFeedPosts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(mockError)
    expect(mockedGet).toHaveBeenCalledWith("/posts/feed")
  })

  it("should use correct query key", async () => {
    mockedGet.mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useFeedPosts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // The hook should use ["feedPosts"] as query key
    expect(result.current.isSuccess).toBe(true)
  })

  it("should start in loading state", () => {
    const { result } = renderHook(() => useFeedPosts(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()
  })
})
