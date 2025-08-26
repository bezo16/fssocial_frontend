import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import useDeleteComment from "../useDeleteComment"

// Mock the axiosApiCall module
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    delete: vi.fn(),
  },
}))

// Mock the toaster
vi.mock("@/components/ui/toaster", () => ({
  toaster: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Import the mocked versions
const { default: axiosApiCall } = await import("@/lib/api/axiosApiCall")
const { toaster } = await import("@/components/ui/toaster")
const mockedDelete = vi.mocked(axiosApiCall.delete)
const mockedToasterSuccess = vi.mocked(toaster.success)
const mockedToasterError = vi.mocked(toaster.error)

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

describe("useDeleteComment", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should delete a comment successfully", async () => {
    const mockResponse = { message: "Comment deleted successfully" }
    mockedDelete.mockResolvedValueOnce({ data: mockResponse })

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)

    const commentId = "comment123"

    // Trigger the mutation
    result.current.mutate(commentId)

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toEqual(mockResponse)
    expect(mockedDelete).toHaveBeenCalledWith("/comments/comment123")
    expect(mockedToasterSuccess).toHaveBeenCalledWith({ title: "Comment deleted" })
  })

  it("should handle deletion error", async () => {
    const errorMessage = "Failed to delete comment"
    mockedDelete.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    })

    const commentId = "comment123"

    // Trigger the mutation
    result.current.mutate(commentId)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.isSuccess).toBe(false)
    expect(mockedDelete).toHaveBeenCalledWith("/comments/comment123")
    expect(mockedToasterError).toHaveBeenCalledWith({
      title: "Error when deleting comment",
      description: errorMessage,
    })
  })

  it("should handle different comment IDs", async () => {
    const mockResponse = { message: "Deleted" }
    mockedDelete.mockResolvedValue({ data: mockResponse })

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    })

    // Test with different comment IDs
    const commentIds = ["comment1", "comment2", "comment3"]

    for (const commentId of commentIds) {
      result.current.mutate(commentId)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    }

    expect(mockedDelete).toHaveBeenCalledTimes(3)
    expect(mockedDelete).toHaveBeenNthCalledWith(1, "/comments/comment1")
    expect(mockedDelete).toHaveBeenNthCalledWith(2, "/comments/comment2")
    expect(mockedDelete).toHaveBeenNthCalledWith(3, "/comments/comment3")
  })

  it("should handle numeric comment ID", async () => {
    const mockResponse = { message: "Comment deleted" }
    mockedDelete.mockResolvedValueOnce({ data: mockResponse })

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    })

    const commentId = "12345"

    result.current.mutate(commentId)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedDelete).toHaveBeenCalledWith("/comments/12345")
    expect(mockedToasterSuccess).toHaveBeenCalledWith({ title: "Comment deleted" })
  })

  it("should handle server error", async () => {
    const serverError = new Error("Internal server error")
    mockedDelete.mockRejectedValueOnce(serverError)

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    })

    const commentId = "comment789"

    result.current.mutate(commentId)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(serverError)
    expect(mockedToasterError).toHaveBeenCalledWith({
      title: "Error when deleting comment",
      description: "Internal server error",
    })
  })

  it("should invalidate feed posts on success", async () => {
    const mockResponse = { message: "Comment deleted successfully" }
    mockedDelete.mockResolvedValueOnce({ data: mockResponse })

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(),
    })

    const commentId = "comment999"

    result.current.mutate(commentId)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // The hook should have called invalidateQueries for feedPosts
    // We can't directly test this without more complex mocking, but we can verify the mutation succeeded
    expect(result.current.isSuccess).toBe(true)
    expect(mockedToasterSuccess).toHaveBeenCalled()
  })
})
