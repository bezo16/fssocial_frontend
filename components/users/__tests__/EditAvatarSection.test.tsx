import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import React from "react"
import EditAvatarSection from "../EditAvatarSection"

// Mock the hooks and API
vi.mock("@/lib/hooks/users/useUserDataMe")
vi.mock("@/lib/api/axiosApiCall")

const mockUseUserDataMe = vi.fn()
const mockPost = vi.fn()

vi.mocked(await import("@/lib/hooks/users/useUserDataMe")).default = mockUseUserDataMe
vi.mocked(await import("@/lib/api/axiosApiCall")).default = {
  post: mockPost,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

// Mock URL.createObjectURL
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: vi.fn(() => "mocked-object-url"),
    revokeObjectURL: vi.fn(),
  },
})

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

describe("EditAvatarSection", () => {
  const mockRefetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseUserDataMe.mockReturnValue({
      data: {
        id: "user123",
        username: "testuser",
        avatarUrl: "/test-avatar.jpg",
      },
      refetch: mockRefetch,
    })

    mockPost.mockResolvedValue({ data: { success: true } })
  })

  it("should render avatar section with current avatar", () => {
    render(<EditAvatarSection />, { wrapper: Wrapper })

    expect(screen.getByText("Zmeniť profilovku")).toBeInTheDocument()
    expect(screen.getByAltText("Náhľad profilovky")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /uložiť profilovku/i })).toBeInTheDocument()
  })

  it("should show default avatar when user has no avatarUrl", () => {
    mockUseUserDataMe.mockReturnValue({
      data: {
        id: "user123",
        username: "testuser",
        avatarUrl: null,
      },
      refetch: mockRefetch,
    })

    render(<EditAvatarSection />, { wrapper: Wrapper })

    const image = screen.getByAltText("Náhľad profilovky")
    expect(image).toHaveAttribute("src", "/default-avatar.png")
  })

  it("should show current avatar when user has avatarUrl", () => {
    render(<EditAvatarSection />, { wrapper: Wrapper })

    const image = screen.getByAltText("Náhľad profilovky")
    expect(image).toHaveAttribute("src", "/test-avatar.jpg")
  })

  it("should show preview when file is selected", async () => {
    const user = userEvent.setup()
    const { container } = render(<EditAvatarSection />, { wrapper: Wrapper })

    const fileInput = container.querySelector("input[type=\"file\"]") as HTMLInputElement
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" })

    await user.upload(fileInput, file)

    const image = screen.getByAltText("Náhľad profilovky")
    expect(image).toHaveAttribute("src", "mocked-object-url")
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(file)
  })

  it("should upload file successfully", async () => {
    const user = userEvent.setup()
    const { container } = render(<EditAvatarSection />, { wrapper: Wrapper })

    const fileInput = container.querySelector("input[type=\"file\"]") as HTMLInputElement
    const submitButton = screen.getByRole("button", { name: /uložiť profilovku/i })
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" })

    await user.upload(fileInput, file)
    await user.click(submitButton)

    expect(mockPost).toHaveBeenCalledWith(
      "/users/me/avatar",
      expect.any(FormData),
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    )

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it("should show error when no file is selected and form is submitted", async () => {
    const user = userEvent.setup()
    render(<EditAvatarSection />, { wrapper: Wrapper })

    const submitButton = screen.getByRole("button", { name: /uložiť profilovku/i })
    await user.click(submitButton)

    expect(screen.getByText("Vyberte obrázok")).toBeInTheDocument()
    expect(mockPost).not.toHaveBeenCalled()
  })

  it("should show loading state during upload", async () => {
    const user = userEvent.setup()

    // Mock a delayed response
    mockPost.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 100)),
    )

    const { container } = render(<EditAvatarSection />, { wrapper: Wrapper })

    const fileInput = container.querySelector("input[type=\"file\"]") as HTMLInputElement
    const submitButton = screen.getByRole("button", { name: /uložiť profilovku/i })
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" })

    await user.upload(fileInput, file)
    await user.click(submitButton)

    // Check loading state
    expect(submitButton).toBeDisabled()
    expect(fileInput).toBeDisabled()

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(fileInput).not.toBeDisabled()
    })
  })

  it("should handle upload error", async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockPost.mockRejectedValue(new Error("Upload failed"))

    const { container } = render(<EditAvatarSection />, { wrapper: Wrapper })

    const fileInput = container.querySelector("input[type=\"file\"]") as HTMLInputElement
    const submitButton = screen.getByRole("button", { name: /uložiť profilovku/i })
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" })

    await user.upload(fileInput, file)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Error uploading image")).toBeInTheDocument()
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error uploading image:", expect.any(Error))
    expect(mockRefetch).not.toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it("should clear error when new upload is attempted", async () => {
    const user = userEvent.setup()

    // First, trigger an error
    mockPost.mockRejectedValue(new Error("Upload failed"))

    const { container } = render(<EditAvatarSection />, { wrapper: Wrapper })

    const fileInput = container.querySelector("input[type=\"file\"]") as HTMLInputElement
    const submitButton = screen.getByRole("button", { name: /uložiť profilovku/i })
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" })

    await user.upload(fileInput, file)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Error uploading image")).toBeInTheDocument()
    })

    // Now make the next call succeed
    mockPost.mockResolvedValue({ data: { success: true } })

    const file2 = new File(["test2"], "test2.jpg", { type: "image/jpeg" })
    await user.upload(fileInput, file2)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText("Error uploading image")).not.toBeInTheDocument()
    })
  })

  it("should reset form and preview after successful upload", async () => {
    const user = userEvent.setup()
    const { container } = render(<EditAvatarSection />, { wrapper: Wrapper })

    const fileInput = container.querySelector("input[type=\"file\"]") as HTMLInputElement
    const submitButton = screen.getByRole("button", { name: /uložiť profilovku/i })
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" })

    await user.upload(fileInput, file)

    // Verify preview is showing
    const image = screen.getByAltText("Náhľad profilovky")
    expect(image).toHaveAttribute("src", "mocked-object-url")

    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled()
    })

    // Verify form is reset and preview is cleared
    await waitFor(() => {
      const imageAfter = screen.getByAltText("Náhľad profilovky")
      expect(imageAfter).toHaveAttribute("src", "/test-avatar.jpg")
    })
  })

  it("should handle file input change when no file is selected", async () => {
    const user = userEvent.setup()
    const { container } = render(<EditAvatarSection />, { wrapper: Wrapper })

    const fileInput = container.querySelector("input[type=\"file\"]") as HTMLInputElement

    // First upload a file to set preview
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" })
    await user.upload(fileInput, file)

    // Verify preview is set
    const image = screen.getByAltText("Náhľad profilovky")
    expect(image).toHaveAttribute("src", "mocked-object-url")

    // Simulate clearing the input (browser behavior)
    Object.defineProperty(fileInput, "files", {
      value: null,
      writable: true,
    })

    // Manually trigger the change event
    const changeEvent = new Event("change", { bubbles: true })
    fileInput.dispatchEvent(changeEvent)

    await waitFor(() => {
      const imageAfter = screen.getByAltText("Náhľad profilovky")
      expect(imageAfter).toHaveAttribute("src", "/test-avatar.jpg")
    })
  })
})
