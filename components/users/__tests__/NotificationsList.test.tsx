import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { NotificationsList } from "../NotificationsList"

// Mock the hooks
vi.mock("@/lib/hooks/notifications/useNotifications")

const mockUseNotifications = vi.fn()
const mockUseMarkNotificationRead = vi.fn()
const mockMarkReadMutate = vi.fn()

vi.mocked(await import("@/lib/hooks/notifications/useNotifications")).useNotifications = mockUseNotifications
vi.mocked(await import("@/lib/hooks/notifications/useNotifications")).useMarkNotificationRead = mockUseMarkNotificationRead

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

Wrapper.displayName = "TestWrapper"

describe("NotificationsList", () => {
  const mockNotifications = [
    {
      id: "notif1",
      type: "like",
      message: "Someone liked your post",
      read: false,
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "notif2",
      type: "comment",
      message: "Someone commented on your post",
      read: true,
      createdAt: "2023-01-02T00:00:00Z",
    },
    {
      id: "notif3",
      type: "follow",
      message: "Someone started following you",
      read: false,
      createdAt: "2023-01-03T00:00:00Z",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseMarkNotificationRead.mockReturnValue({
      mutate: mockMarkReadMutate,
      isPending: false,
    })

    mockUseNotifications.mockReturnValue({
      data: mockNotifications,
      isLoading: false,
    })
  })

  it("should return null when userId is not provided", () => {
    const { container } = render(<NotificationsList userId="" />, { wrapper: Wrapper })
    expect(container.firstChild).toBeNull()
  })

  it("should show loading message when loading", () => {
    mockUseNotifications.mockReturnValue({
      data: null,
      isLoading: true,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.getByText("Načítavam notifikácie...")).toBeInTheDocument()
  })

  it("should show empty message when no notifications", () => {
    mockUseNotifications.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.getByText("Žiadne notifikácie")).toBeInTheDocument()
  })

  it("should show empty message when notifications is null", () => {
    mockUseNotifications.mockReturnValue({
      data: null,
      isLoading: false,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.getByText("Žiadne notifikácie")).toBeInTheDocument()
  })

  it("should render list of notifications with correct content", () => {
    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.getByText("Someone liked your post")).toBeInTheDocument()
    expect(screen.getByText("Someone commented on your post")).toBeInTheDocument()
    expect(screen.getByText("Someone started following you")).toBeInTheDocument()
  })

  it("should show correct icons for different notification types", () => {
    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    // Check that emojis are rendered (they appear as text content)
    expect(screen.getByText("❤️")).toBeInTheDocument() // like
    expect(screen.getByText("💬")).toBeInTheDocument() // comment
    expect(screen.getByText("👤")).toBeInTheDocument() // follow
  })

  it("should show custom icon for unknown notification types", () => {
    const notificationsWithCustomType = [
      {
        id: "notif1",
        type: "unknown",
        message: "Unknown notification type",
        read: false,
        createdAt: "2023-01-01T00:00:00Z",
      },
    ]

    mockUseNotifications.mockReturnValue({
      data: notificationsWithCustomType,
      isLoading: false,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.getByText("🔔")).toBeInTheDocument() // custom icon
    expect(screen.getByText("Unknown notification type")).toBeInTheDocument()
  })

  it("should format creation date correctly", () => {
    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    // The date should be formatted using toLocaleString()
    const dateElements = screen.getAllByText(/2023/)
    expect(dateElements.length).toBeGreaterThan(0)
  })

  it("should show mark as read button for unread notifications", () => {
    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    const markReadButtons = screen.getAllByText("Označiť ako prečítané")
    // Should have 2 buttons (for 2 unread notifications)
    expect(markReadButtons).toHaveLength(2)
  })

  it("should not show mark as read button for read notifications", () => {
    const readNotifications = [
      {
        id: "notif1",
        type: "like",
        message: "Read notification",
        read: true,
        createdAt: "2023-01-01T00:00:00Z",
      },
    ]

    mockUseNotifications.mockReturnValue({
      data: readNotifications,
      isLoading: false,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.queryByText("Označiť ako prečítané")).not.toBeInTheDocument()
  })

  it("should call markRead mutation when mark as read button is clicked", async () => {
    const user = userEvent.setup()
    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    const markReadButtons = screen.getAllByText("Označiť ako prečítané")
    await user.click(markReadButtons[0])

    expect(mockMarkReadMutate).toHaveBeenCalledWith("notif1")
  })

  it("should disable mark as read button when mutation is pending", () => {
    mockUseMarkNotificationRead.mockReturnValue({
      mutate: mockMarkReadMutate,
      isPending: true,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    const markReadButtons = screen.getAllByText("Označiť ako prečítané")
    markReadButtons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it("should show unread indicator for unread notifications", () => {
    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    // Unread notifications should have blue pulse indicators
    const unreadIndicators = document.querySelectorAll(".animate-pulse")
    expect(unreadIndicators.length).toBe(2) // 2 unread notifications
  })

  it("should apply different styles for read vs unread notifications", () => {
    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    const notifications = screen.getAllByRole("listitem")

    // Check that different CSS classes are applied
    expect(notifications[0]).toHaveClass("bg-blue-50") // unread
    expect(notifications[1]).toHaveClass("bg-white") // read
    expect(notifications[2]).toHaveClass("bg-blue-50") // unread
  })

  it("should handle multiple notifications of the same type", () => {
    const sameTypeNotifications = [
      {
        id: "notif1",
        type: "like",
        message: "First like",
        read: false,
        createdAt: "2023-01-01T00:00:00Z",
      },
      {
        id: "notif2",
        type: "like",
        message: "Second like",
        read: true,
        createdAt: "2023-01-02T00:00:00Z",
      },
    ]

    mockUseNotifications.mockReturnValue({
      data: sameTypeNotifications,
      isLoading: false,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.getByText("First like")).toBeInTheDocument()
    expect(screen.getByText("Second like")).toBeInTheDocument()

    // Both should have like icons
    const likeIcons = screen.getAllByText("❤️")
    expect(likeIcons).toHaveLength(2)
  })

  it("should handle notifications with undefined type", () => {
    const notificationsWithUndefinedType = [
      {
        id: "notif1",
        type: undefined,
        message: "Notification with undefined type",
        read: false,
        createdAt: "2023-01-01T00:00:00Z",
      },
    ]

    mockUseNotifications.mockReturnValue({
      data: notificationsWithUndefinedType,
      isLoading: false,
    })

    render(<NotificationsList userId="user123" />, { wrapper: Wrapper })

    expect(screen.getByText("🔔")).toBeInTheDocument() // should fallback to custom icon
    expect(screen.getByText("Notification with undefined type")).toBeInTheDocument()
  })
})
