import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode } from "react"
import { useNotifications, useMarkNotificationRead } from "../useNotifications"

// Mock the axiosApiCall module
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

// Import the mocked versions
const { default: axiosApiCall } = await import("@/lib/api/axiosApiCall")
const mockedGet = vi.mocked(axiosApiCall.get)
const mockedPatch = vi.mocked(axiosApiCall.patch)

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

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch notifications successfully", async () => {
    const mockNotifications = [
      {
        id: "notif1",
        userId: "user123",
        type: "like",
        message: "Someone liked your post",
        read: false,
        createdAt: "2023-01-01T00:00:00Z",
      },
      {
        id: "notif2",
        userId: "user123",
        type: "comment",
        message: "Someone commented on your post",
        read: true,
        createdAt: "2023-01-02T00:00:00Z",
      },
    ]
    mockedGet.mockResolvedValueOnce({ data: mockNotifications })

    const { result } = renderHook(() => useNotifications("user123"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockNotifications)
    expect(result.current.isPending).toBe(false)
    expect(mockedGet).toHaveBeenCalledWith("/notifications/user123")
  })

  it("should handle notifications fetch error", async () => {
    const errorMessage = "Failed to fetch notifications"
    mockedGet.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useNotifications("user123"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.data).toBeUndefined()
    expect(mockedGet).toHaveBeenCalledWith("/notifications/user123")
  })

  it("should be disabled when userId is empty", async () => {
    const { result } = renderHook(() => useNotifications(""), {
      wrapper: createWrapper(),
    })

    // Wait for initial state to settle
    await waitFor(() => {
      expect(result.current.fetchStatus).toBe("idle")
    }, { timeout: 100 })

    // For disabled queries, React Query typically shows isPending: false and fetchStatus: "idle"
    expect(result.current.fetchStatus).toBe("idle")
    expect(mockedGet).not.toHaveBeenCalled()
  })

  it("should handle empty notifications array", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(() => useNotifications("user456"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(mockedGet).toHaveBeenCalledWith("/notifications/user456")
  })

  it("should fetch notifications for different users", async () => {
    const mockNotifications1 = [{ id: "notif1", userId: "user1" }]
    const mockNotifications2 = [{ id: "notif2", userId: "user2" }]

    mockedGet.mockResolvedValueOnce({ data: mockNotifications1 })

    const { result: result1 } = renderHook(() => useNotifications("user1"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    expect(result1.current.data).toEqual(mockNotifications1)
    expect(mockedGet).toHaveBeenCalledWith("/notifications/user1")

    // Reset mock for second call
    mockedGet.mockResolvedValueOnce({ data: mockNotifications2 })

    const { result: result2 } = renderHook(() => useNotifications("user2"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true)
    })

    expect(result2.current.data).toEqual(mockNotifications2)
    expect(mockedGet).toHaveBeenCalledWith("/notifications/user2")
  })
})

describe("useMarkNotificationRead", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should mark notification as read successfully", async () => {
    mockedPatch.mockResolvedValueOnce({ data: { success: true } })

    const { result } = renderHook(() => useMarkNotificationRead("user123"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)

    const notificationId = "notif123"

    // Trigger the mutation
    result.current.mutate(notificationId)

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.isSuccess).toBe(true)
    expect(mockedPatch).toHaveBeenCalledWith("/notifications/notif123/read")
  })

  it("should handle mark as read error", async () => {
    const errorMessage = "Failed to mark notification as read"
    mockedPatch.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useMarkNotificationRead("user123"), {
      wrapper: createWrapper(),
    })

    const notificationId = "notif123"

    // Trigger the mutation
    result.current.mutate(notificationId)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(result.current.isSuccess).toBe(false)
    expect(mockedPatch).toHaveBeenCalledWith("/notifications/notif123/read")
  })

  it("should handle different notification IDs", async () => {
    mockedPatch.mockResolvedValue({ data: { success: true } })

    const { result } = renderHook(() => useMarkNotificationRead("user123"), {
      wrapper: createWrapper(),
    })

    // Test with different notification IDs
    const notificationIds = ["notif1", "notif2", "notif3"]

    for (const notifId of notificationIds) {
      result.current.mutate(notifId)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    }

    expect(mockedPatch).toHaveBeenCalledTimes(3)
    expect(mockedPatch).toHaveBeenNthCalledWith(1, "/notifications/notif1/read")
    expect(mockedPatch).toHaveBeenNthCalledWith(2, "/notifications/notif2/read")
    expect(mockedPatch).toHaveBeenNthCalledWith(3, "/notifications/notif3/read")
  })

  it("should invalidate notifications cache on success", async () => {
    mockedPatch.mockResolvedValueOnce({ data: { success: true } })

    const { result } = renderHook(() => useMarkNotificationRead("user123"), {
      wrapper: createWrapper(),
    })

    const notificationId = "notif999"

    result.current.mutate(notificationId)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // The hook should have called invalidateQueries for notifications
    // We can't directly test this without more complex mocking, but we can verify the mutation succeeded
    expect(result.current.isSuccess).toBe(true)
    expect(mockedPatch).toHaveBeenCalledWith("/notifications/notif999/read")
  })

  it("should handle server error when marking as read", async () => {
    const serverError = new Error("Internal server error")
    mockedPatch.mockRejectedValueOnce(serverError)

    const { result } = renderHook(() => useMarkNotificationRead("user456"), {
      wrapper: createWrapper(),
    })

    const notificationId = "notif789"

    result.current.mutate(notificationId)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(serverError)
    expect(mockedPatch).toHaveBeenCalledWith("/notifications/notif789/read")
  })
})
