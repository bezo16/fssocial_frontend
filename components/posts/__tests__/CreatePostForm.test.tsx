import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "@/components/ui/provider"
import CreatePostForm from "../CreatePostForm"

// Mock axiosApiCall
vi.mock("@/lib/api/axiosApiCall", () => ({
  default: {
    post: vi.fn(),
  },
}))

// Mock toaster
vi.mock("@/components/ui/toaster", () => ({
  default: () => null,
  Toaster: () => null,
  toaster: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Import the mocked version
const { default: axiosApiCall } = await import("@/lib/api/axiosApiCall")
const mockedPost = vi.mocked(axiosApiCall.post)

const { toaster } = await import("@/components/ui/toaster")
const mockedToaster = vi.mocked(toaster.success)

// Test wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )

  return Wrapper
}

describe("CreatePostForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders all form fields", () => {
    render(<CreatePostForm />, { wrapper: createWrapper() })

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Content")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Image URL")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create Post" })).toBeInTheDocument()
  })

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup()
    render(<CreatePostForm />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole("button", { name: "Create Post" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument()
      expect(screen.getByText("Content is required")).toBeInTheDocument()
    })
  })

  it("validates image URL format", async () => {
    const user = userEvent.setup()
    render(<CreatePostForm />, { wrapper: createWrapper() })

    const imageUrlInput = screen.getByPlaceholderText("Image URL")
    await user.type(imageUrlInput, "invalid-url")
    const submitButton = screen.getByRole("button", { name: "Create Post" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Invalid image URL format")).toBeInTheDocument()
    })
  })

  it("accepts valid image URL format", async () => {
    const user = userEvent.setup()
    render(<CreatePostForm />, { wrapper: createWrapper() })

    const imageUrlInput = screen.getByPlaceholderText("Image URL")
    await user.type(imageUrlInput, "https://example.com/image.jpg")

    // Should not show validation error
    expect(screen.queryByText("Invalid image URL format")).not.toBeInTheDocument()
  })

  it("submits form with valid data", async () => {
    const user = userEvent.setup()
    mockedPost.mockResolvedValue({ data: { id: "post123" } })

    render(<CreatePostForm />, { wrapper: createWrapper() })

    await user.type(screen.getByPlaceholderText("Title"), "Test Post Title")
    await user.type(screen.getByPlaceholderText("Content"), "Test post content")
    await user.type(screen.getByPlaceholderText("Image URL"), "https://example.com/image.jpg")

    await user.click(screen.getByRole("button", { name: "Create Post" }))

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/posts", {
        title: "Test Post Title",
        content: "Test post content",
        imageUrl: "https://example.com/image.jpg",
      })
      expect(mockedToaster).toHaveBeenCalledWith({
        title: "Post created",
        description: "Your post has been created successfully",
        closable: true,
      })
    })
  })

  it("handles form submission without image URL", async () => {
    const user = userEvent.setup()
    mockedPost.mockResolvedValue({ data: { id: "post123" } })

    render(<CreatePostForm />, { wrapper: createWrapper() })

    await user.type(screen.getByPlaceholderText("Title"), "Test Post Title")
    await user.type(screen.getByPlaceholderText("Content"), "Test post content")

    await user.click(screen.getByRole("button", { name: "Create Post" }))

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/posts", {
        title: "Test Post Title",
        content: "Test post content",
        imageUrl: "",
      })
    })
  })

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup()
    // Make the promise not resolve immediately
    mockedPost.mockImplementation(() => new Promise(() => {}))

    render(<CreatePostForm />, { wrapper: createWrapper() })

    await user.type(screen.getByPlaceholderText("Title"), "Test Title")
    await user.type(screen.getByPlaceholderText("Content"), "Test Content")

    const submitButton = screen.getByRole("button", { name: "Create Post" })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
  })

  it("handles API error gracefully", async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockedPost.mockRejectedValue(new Error("API Error"))

    render(<CreatePostForm />, { wrapper: createWrapper() })

    await user.type(screen.getByPlaceholderText("Title"), "Test Title")
    await user.type(screen.getByPlaceholderText("Content"), "Test Content")

    await user.click(screen.getByRole("button", { name: "Create Post" }))

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Post creation error:", expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })
})
