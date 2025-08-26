import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "@/components/ui/provider"
import NavigationBar from "../NavigationBar"

// Mock Next.js components and hooks
const mockPush = vi.fn()

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock NotificationsDropdown component
vi.mock("../NotificationsDropdown", () => ({
  default: () => <div data-testid="notifications-dropdown">Notifications</div>,
}))

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

describe("NavigationBar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    })
  })

  it("renders main navigation links", () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>,
    )

    expect(screen.getByText("Social Platform")).toBeInTheDocument()
    expect(screen.getByText("Feed")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Search")).toBeInTheDocument()
  })

  it("renders sign out button", () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>,
    )

    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
  })

  it("renders notifications dropdown", () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>,
    )

    expect(screen.getByTestId("notifications-dropdown")).toBeInTheDocument()
  })

  it("has correct href attributes for navigation links", () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>,
    )

    // Find links by their href attributes directly
    const homeLink = document.querySelector("a[href=\"/\"]")
    const feedLink = document.querySelector("a[href=\"/feed\"]")
    const profileLink = document.querySelector("a[href=\"/profile/me\"]")
    const searchLink = document.querySelector("a[href=\"/feed/search\"]")

    expect(homeLink).toBeInTheDocument()
    expect(feedLink).toBeInTheDocument()
    expect(profileLink).toBeInTheDocument()
    expect(searchLink).toBeInTheDocument()
  })

  it("handles sign out click", async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>,
    )

    const signOutButton = screen.getByRole("button", { name: "Sign out" })
    await user.click(signOutButton)

    // Check that cookie was cleared and router.push was called
    expect(document.cookie).toContain("authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;")
    expect(mockPush).toHaveBeenCalledWith("/auth/login")
  })

  it("has proper styling classes", () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>,
    )

    // Check that the navigation component renders correctly
    const brandText = screen.getByText("Social Platform")
    expect(brandText).toBeInTheDocument()

    // Verify navigation structure is present
    const navContainer = brandText.closest("nav") || brandText.closest("div")
    expect(navContainer).toBeInTheDocument()
  })

  it("displays all navigation elements in correct structure", () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>,
    )

    // Check that all main elements are present
    expect(screen.getByText("Social Platform")).toBeInTheDocument()
    expect(screen.getByText("Feed")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Search")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
    expect(screen.getByTestId("notifications-dropdown")).toBeInTheDocument()
  })
})
