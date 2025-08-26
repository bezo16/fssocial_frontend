import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import NotificationsDropdown from "../NotificationsDropdown"

// Mock the hooks
vi.mock("@/lib/hooks/users/useUserDataMe")
vi.mock("@/lib/hooks/notifications/useNotifications")
vi.mock("@/components/users/NotificationsList", () => ({
  NotificationsList: () => <div data-testid="notifications-list">Mock Notifications</div>,
}))

const mockUseUserDataMe = vi.fn()
const mockUseNotifications = vi.fn()

vi.mocked(await import("@/lib/hooks/users/useUserDataMe")).default = mockUseUserDataMe
vi.mocked(await import("@/lib/hooks/notifications/useNotifications")).useNotifications = mockUseNotifications

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

Wrapper.displayName = "TestWrapper"

describe("NotificationsDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseUserDataMe.mockReturnValue({
      data: { id: "user123", username: "testuser" },
      isLoading: false,
      isError: false,
    })

    mockUseNotifications.mockReturnValue({
      data: [
        { id: "1", read: false, message: "Test notification" },
        { id: "2", read: true, message: "Read notification" },
      ],
      isLoading: false,
      isError: false,
    })
  })

  it("should render notification button", () => {
    render(<NotificationsDropdown />, { wrapper: Wrapper })

    const button = screen.getByRole("button", { name: /zobraziť notifikácie/i })
    expect(button).toBeInTheDocument()
  })

  it("should show unread count badge", () => {
    render(<NotificationsDropdown />, { wrapper: Wrapper })

    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("should toggle dropdown when clicked", async () => {
    const user = userEvent.setup()
    render(<NotificationsDropdown />, { wrapper: Wrapper })

    const button = screen.getByRole("button", { name: /zobraziť notifikácie/i })

    // Initially closed
    expect(screen.queryByText("Notifikácie")).not.toBeInTheDocument()

    // Click to open
    await user.click(button)
    expect(screen.getByText("Notifikácie")).toBeInTheDocument()

    // Click to close
    await user.click(button)
    expect(screen.queryByText("Notifikácie")).not.toBeInTheDocument()
  })

  it("should close dropdown when clicking outside", async () => {
    const user = userEvent.setup()
    render(
      <div>
        <NotificationsDropdown />
        <div data-testid="outside">Outside</div>
      </div>,
      { wrapper: Wrapper },
    )

    const button = screen.getByRole("button", { name: /zobraziť notifikácie/i })

    // Open dropdown
    await user.click(button)
    expect(screen.getByText("Notifikácie")).toBeInTheDocument()

    // Click outside
    await user.click(screen.getByTestId("outside"))

    await waitFor(() => {
      expect(screen.queryByText("Notifikácie")).not.toBeInTheDocument()
    })
  })

  it("should show no badge when no unread notifications", () => {
    mockUseNotifications.mockReturnValue({
      data: [{ id: "1", read: true, message: "All read" }],
      isLoading: false,
      isError: false,
    })

    render(<NotificationsDropdown />, { wrapper: Wrapper })

    expect(screen.queryByText("1")).not.toBeInTheDocument()
  })

  it("should handle loading state", async () => {
    mockUseUserDataMe.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    })

    const user = userEvent.setup()
    render(<NotificationsDropdown />, { wrapper: Wrapper })

    const button = screen.getByRole("button", { name: /zobraziť notifikácie/i })
    await user.click(button)

    expect(screen.getByText("Načítavam...")).toBeInTheDocument()
  })

  it("should render notifications list when user is available", async () => {
    const user = userEvent.setup()
    render(<NotificationsDropdown />, { wrapper: Wrapper })

    const button = screen.getByRole("button", { name: /zobraziť notifikácie/i })
    await user.click(button)

    expect(screen.getByTestId("notifications-list")).toBeInTheDocument()
  })
})
