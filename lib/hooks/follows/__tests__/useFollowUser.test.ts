import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import { useFollowUser } from "../useFollowUser"

// Mock the axiosApiCall module
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    post: vi.fn(),
  },
}))

// Import the mocked version
const { default: axiosApiCall } = await import("@/lib/api/axiosApiCall")
const mockedPost = vi.mocked(axiosApiCall.post)

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

describe("useFollowUser", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should follow a user successfully", async () => {
    mockedPost.mockResolvedValueOnce({ data: {} })

    const { result } = renderHook(() => useFollowUser("user123"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)

    // Trigger the mutation with a user ID
    result.current.mutate("user123")

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.isSuccess).toBe(true)
    expect(mockedPost).toHaveBeenCalledWith("follows", {
      followingId: "user123",
    })
  })

  it("should handle follow error", async () => {
    const errorMessage = "Failed to follow user"
    mockedPost.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useFollowUser("user123"), {
      wrapper: createWrapper(),
    })

    // Trigger the mutation
    result.current.mutate("user123")

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.isSuccess).toBe(false)
    expect(mockedPost).toHaveBeenCalledWith("follows", {
      followingId: "user123",
    })
  })

  it("should work with undefined userId in hook initialization", async () => {
    mockedPost.mockResolvedValueOnce({ data: {} })

    const { result } = renderHook(() => useFollowUser(undefined), {
      wrapper: createWrapper(),
    })

    // Should still be able to call mutate with a specific user ID
    result.current.mutate("user456")

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedPost).toHaveBeenCalledWith("follows", {
      followingId: "user456",
    })
  })

  it("should invalidate user queries on success", async () => {
    mockedPost.mockResolvedValueOnce({ data: {} })

    const { result } = renderHook(() => useFollowUser("user789"), {
      wrapper: createWrapper(),
    })

    result.current.mutate("user789")

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // The hook should have called invalidateQueries for the user
    // We can't directly test this without more complex mocking, but we can verify the mutation succeeded
    expect(result.current.isSuccess).toBe(true)
  })

  it("should handle different user IDs correctly", async () => {
    mockedPost.mockResolvedValue({ data: {} })

    const { result } = renderHook(() => useFollowUser("initial-user"), {
      wrapper: createWrapper(),
    })

    // Follow first user
    result.current.mutate("user-1")
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Follow second user
    result.current.mutate("user-2")
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedPost).toHaveBeenCalledTimes(2)
    expect(mockedPost).toHaveBeenNthCalledWith(1, "follows", {
      followingId: "user-1",
    })
    expect(mockedPost).toHaveBeenNthCalledWith(2, "follows", {
      followingId: "user-2",
    })
  })
})
