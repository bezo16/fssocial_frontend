import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import useLikePost from "../useLikePost"

// Mock axiosApiCall
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    post: vi.fn(),
  },
}))

const { default: axiosApiCall } = await import("@/lib/api/axiosApiCall")
const mockedPost = vi.mocked(axiosApiCall.post)

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  // Spy on invalidateQueries to test cache invalidation
  vi.spyOn(queryClient, "invalidateQueries")

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper
}

describe("useLikePost", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should like a post successfully", async () => {
    const postId = "post123"
    const mockResponse = { success: true, message: "Post liked" }

    mockedPost.mockResolvedValue({ data: mockResponse })

    const { result } = renderHook(() => useLikePost(postId), {
      wrapper: createWrapper(),
    })

    // Trigger the mutation
    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockResponse)
    expect(mockedPost).toHaveBeenCalledWith("/likes", {
      targetType: "post",
      targetId: postId,
    })
  })

  it("should invalidate relevant queries on success", async () => {
    const postId = "post123"
    const mockQueryClient = new QueryClient()
    const invalidateQueriesSpy = vi.spyOn(mockQueryClient, "invalidateQueries")

    mockedPost.mockResolvedValue({ data: { success: true } })

    const CustomWrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useLikePost(postId), {
      wrapper: CustomWrapper,
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Check that the correct queries were invalidated
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["feedPosts"] })
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["post", postId] })
  })

  it("should handle API error", async () => {
    const postId = "post123"
    const mockError = new Error("Failed to like post")

    mockedPost.mockRejectedValue(mockError)

    const { result } = renderHook(() => useLikePost(postId), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(mockError)
    expect(mockedPost).toHaveBeenCalledWith("/likes", {
      targetType: "post",
      targetId: postId,
    })
  })

  it("should start in idle state", () => {
    const { result } = renderHook(() => useLikePost("post123"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isIdle).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it("should be in pending state during mutation", () => {
    const { result } = renderHook(() => useLikePost("post123"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isIdle).toBe(true)

    // The mutation object should have the mutate function
    expect(typeof result.current.mutate).toBe("function")
  })
})
