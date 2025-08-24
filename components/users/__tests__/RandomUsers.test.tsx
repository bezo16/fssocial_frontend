import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import React from "react"
import RandomUsers from "../RandomUsers"

// Mock the hooks and navigation
vi.mock("@/lib/hooks/users/useRandomUsers")
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

const mockUseRandomUsers = vi.fn()
const mockPush = vi.fn()
const mockUseRouter = vi.fn()

vi.mocked(await import("@/lib/hooks/users/useRandomUsers")).default = mockUseRandomUsers
vi.mocked(await import("next/navigation")).useRouter = mockUseRouter

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}

Wrapper.displayName = "TestWrapper"

describe("RandomUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseRouter.mockReturnValue({
      push: mockPush,
    })

    mockUseRandomUsers.mockReturnValue({
      data: [
        { id: "user1", username: "john_doe" },
        { id: "user2", username: "jane_smith" },
        { id: "user3", username: "bob_wilson" },
      ],
      isLoading: false,
      isError: false,
    })
  })

  it("should render heading", () => {
    render(<RandomUsers />, { wrapper: Wrapper })

    expect(screen.getByText("Random Users")).toBeInTheDocument()
  })

  it("should render list of users with avatars and usernames", () => {
    render(<RandomUsers />, { wrapper: Wrapper })

    expect(screen.getByText("john_doe")).toBeInTheDocument()
    expect(screen.getByText("jane_smith")).toBeInTheDocument()
    expect(screen.getByText("bob_wilson")).toBeInTheDocument()

    // Check for avatar initials (both john_doe and jane_smith start with J)
    const jInitials = screen.getAllByText("J")
    expect(jInitials).toHaveLength(2) // john_doe and jane_smith
    expect(screen.getByText("B")).toBeInTheDocument() // bob_wilson
  })

  it("should show loading spinner when loading", () => {
    mockUseRandomUsers.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    render(<RandomUsers />, { wrapper: Wrapper })

    // Chakra UI Spinner doesn't have role="status", so let's find it by class or text content
    expect(screen.getByText("Random Users")).toBeInTheDocument()
    const spinner = document.querySelector(".chakra-spinner")
    expect(spinner).toBeInTheDocument()
    expect(screen.queryByText("john_doe")).not.toBeInTheDocument()
  })

  it("should show error message when error occurs", () => {
    mockUseRandomUsers.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    })

    render(<RandomUsers />, { wrapper: Wrapper })

    expect(screen.getByText("Failed to load users.")).toBeInTheDocument()
    expect(screen.queryByText("john_doe")).not.toBeInTheDocument()
  })

  it("should show 'No users found' when users array is empty", () => {
    mockUseRandomUsers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })

    render(<RandomUsers />, { wrapper: Wrapper })

    expect(screen.getByText("No users found.")).toBeInTheDocument()
  })

  it("should handle null users data", () => {
    mockUseRandomUsers.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    })

    render(<RandomUsers />, { wrapper: Wrapper })

    expect(screen.getByText("No users found.")).toBeInTheDocument()
  })

  it("should navigate to user profile when user is clicked", async () => {
    const user = userEvent.setup()
    render(<RandomUsers />, { wrapper: Wrapper })

    const userItem = screen.getByText("john_doe").closest("li")
    expect(userItem).toBeInTheDocument()

    await user.click(userItem!)

    expect(mockPush).toHaveBeenCalledWith("/profile/user1")
  })

  it("should be focusable but not handle keyboard navigation", async () => {
    const user = userEvent.setup()
    render(<RandomUsers />, { wrapper: Wrapper })

    const userItem = screen.getByText("jane_smith").closest("li")
    expect(userItem).toBeInTheDocument()

    userItem!.focus()
    expect(userItem).toHaveFocus()

    await user.keyboard("{Enter}")
    await user.keyboard(" ")

    // Keyboard events are not handled, so navigation should not occur
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("should generate correct avatar initials", () => {
    mockUseRandomUsers.mockReturnValue({
      data: [
        { id: "user1", username: "alice" },
        { id: "user2", username: "DAVID" },
        { id: "user3", username: "emma_jones" },
      ],
      isLoading: false,
      isError: false,
    })

    render(<RandomUsers />, { wrapper: Wrapper })

    expect(screen.getByText("A")).toBeInTheDocument() // alice -> A
    expect(screen.getByText("D")).toBeInTheDocument() // DAVID -> D
    expect(screen.getByText("E")).toBeInTheDocument() // emma_jones -> E
  })

  it("should handle users with empty or undefined usernames", () => {
    mockUseRandomUsers.mockReturnValue({
      data: [
        { id: "user1", username: "" },
        { id: "user2", username: undefined },
        { id: "user3", username: "valid_user" },
      ],
      isLoading: false,
      isError: false,
    })

    render(<RandomUsers />, { wrapper: Wrapper })

    // Should still render the valid user
    expect(screen.getByText("valid_user")).toBeInTheDocument()
    expect(screen.getByText("V")).toBeInTheDocument()

    // Empty/undefined usernames should render empty strings but still be clickable
    const allUsers = screen.getAllByRole("button")
    expect(allUsers).toHaveLength(3) // All three users should be rendered as clickable items
  })

  it("should apply hover styles on user items", async () => {
    const user = userEvent.setup()
    render(<RandomUsers />, { wrapper: Wrapper })

    const userItem = screen.getByText("john_doe").closest("li")
    expect(userItem).toBeInTheDocument()

    // Hover over the user item
    await user.hover(userItem!)

    // The hover styles are applied via Chakra UI classes,
    // so we just verify the element is interactive
    expect(userItem).toHaveAttribute("role", "button")
    expect(userItem).toHaveAttribute("tabIndex", "0")
  })

  it("should not show content when both loading and error are false but data is loading", () => {
    mockUseRandomUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    })

    render(<RandomUsers />, { wrapper: Wrapper })

    // Should show "No users found" when data is undefined but not loading or error
    expect(screen.getByText("No users found.")).toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })
})
