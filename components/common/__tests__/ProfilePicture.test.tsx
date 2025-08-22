import { render } from "@testing-library/react"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import ProfilePicture from "../ProfilePicture"
import { Provider } from "@/components/ui/provider"

// Wrapper component to provide Chakra UI context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

describe("ProfilePicture", () => {
  const mockEnv = process.env

  beforeEach(() => {
    process.env = { ...mockEnv, NEXT_PUBLIC_API_URL: "http://localhost:4000" }
  })

  afterEach(() => {
    process.env = mockEnv
  })

  it("renders with correct avatar image src", () => {
    render(
      <TestWrapper>
        <ProfilePicture avatarUrl="/avatars/test.jpg" username="testuser" />
      </TestWrapper>,
    )

    // Find the image element directly by its src attribute
    const expectedSrc = "http://localhost:4000/avatars/test.jpg"
    const avatarImage = document.querySelector(`img[src="${expectedSrc}"]`)
    expect(avatarImage).toBeTruthy()
    expect(avatarImage).toHaveAttribute("src", expectedSrc)
  })

  it("displays fallback with username when image fails to load", () => {
    render(
      <TestWrapper>
        <ProfilePicture avatarUrl="/invalid-url" username="John Doe" />
      </TestWrapper>,
    )

    // The fallback should contain initials of the username - look for the span with fallback
    const fallbackElement = document.querySelector("[data-part=\"fallback\"]")
    expect(fallbackElement).toBeInTheDocument()
    expect(fallbackElement).toHaveTextContent("JD")
  })

  it("has correct size styling", () => {
    render(
      <TestWrapper>
        <ProfilePicture avatarUrl="/avatars/test.jpg" username="testuser" />
      </TestWrapper>,
    )

    const avatar = document.querySelector("[data-part=\"root\"]")
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveClass("chakra-avatar__root")
  })

  it("handles empty avatar URL", () => {
    render(
      <TestWrapper>
        <ProfilePicture avatarUrl="" username="Test User" />
      </TestWrapper>,
    )

    // Check if the component renders with empty URL - look for the image element
    const avatarImage = document.querySelector("[data-part=\"image\"]")
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute("src", "http://localhost:4000")
  })

  it("handles special characters in username", () => {
    render(
      <TestWrapper>
        <ProfilePicture avatarUrl="/avatars/test.jpg" username="José María" />
      </TestWrapper>,
    )

    // Should handle special characters gracefully in fallback
    const avatarRoot = document.querySelector("[data-part=\"root\"]")
    expect(avatarRoot).toBeInTheDocument()

    // Check that fallback shows initials
    const fallbackElement = document.querySelector("[data-part=\"fallback\"]")
    expect(fallbackElement).toBeInTheDocument()
    expect(fallbackElement).toHaveTextContent("JM")
  })
})
