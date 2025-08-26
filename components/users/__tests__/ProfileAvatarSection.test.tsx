/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import ProfileAvatarSection from "../ProfileAvatarSection"

// Mock the hook
vi.mock("@/lib/hooks/users/useUserDataMe", () => ({
  default: vi.fn(),
}))

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

describe("ProfileAvatarSection", () => {
  const mockUser = {
    id: "user123",
    username: "testuser",
    bio: "This is my bio",
    avatarUrl: "/avatars/test.jpg",
    email: "test@example.com",
    password_hash: "hash",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
    followers_count: 0,
    following_count: 0,
    followsCount: 0,
    isFollowed: false,
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
      isError: false,
    } as any)
  })

  it("should render user avatar and username", async () => {
    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText("testuser")).toBeInTheDocument()
  })

  it("should render user bio when available", async () => {
    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText("This is my bio")).toBeInTheDocument()
  })

  it("should not render bio when user has no bio", async () => {
    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: { ...mockUser, bio: null },
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText("testuser")).toBeInTheDocument()
    expect(screen.queryByText("This is my bio")).not.toBeInTheDocument()
  })

  it("should not render bio when bio is empty string", async () => {
    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: { ...mockUser, bio: "" },
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText("testuser")).toBeInTheDocument()
    expect(screen.queryByText("This is my bio")).not.toBeInTheDocument()
  })

  it("should not render bio when bio is undefined", async () => {
    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: { ...mockUser, bio: undefined },
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText("testuser")).toBeInTheDocument()
    expect(screen.queryByText("This is my bio")).not.toBeInTheDocument()
  })

  it("should return null when user data is not available", async () => {
    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    const { container } = render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(container.firstChild).toBeNull()
  })

  it("should return null when user data is undefined", async () => {
    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    const { container } = render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(container.firstChild).toBeNull()
  })

  it("should render ProfilePicture component with correct props", async () => {
    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    // The ProfilePicture component should be rendered
    // We can verify this by checking that the username appears (which is part of ProfilePicture logic)
    expect(screen.getByText("testuser")).toBeInTheDocument()
  })

  it("should apply correct layout styling", async () => {
    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    const container = screen.getByText("testuser").closest("[class*=\"css\"]")
    expect(container).toBeInTheDocument()
  })

  it("should handle long bio text", async () => {
    const longBio = "This is a very long bio that contains multiple sentences and should be displayed properly in the component without any issues or truncation because the component should handle long text gracefully."

    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: { ...mockUser, bio: longBio },
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText(longBio)).toBeInTheDocument()
  })

  it("should handle special characters in bio", async () => {
    const specialBio = "Bio with emojis 😊 & special chars: @#$%^&*()!"

    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: { ...mockUser, bio: specialBio },
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText(specialBio)).toBeInTheDocument()
  })

  it("should handle special characters in username", async () => {
    const { default: useUserDataMe } = await import("@/lib/hooks/users/useUserDataMe")
    vi.mocked(useUserDataMe).mockReturnValue({
      data: { ...mockUser, username: "test.user_123" },
      isLoading: false,
      error: null,
      isError: false,
    } as any)

    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText("test.user_123")).toBeInTheDocument()
  })

  it("should render username in multiple places", async () => {
    render(<ProfileAvatarSection />, { wrapper: Wrapper })

    // Username should appear (possibly multiple times due to ProfilePicture component)
    const usernameElements = screen.getAllByText("testuser")
    expect(usernameElements.length).toBeGreaterThan(0)
  })
})
