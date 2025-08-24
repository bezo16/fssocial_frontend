/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import FeedPage from "../page"
import type { FeedPost } from "@/lib/types/feed"

// Mock the custom hooks
vi.mock("@/lib/hooks/posts/useFeedPosts", () => ({
  default: vi.fn(),
}))

// Mock the components
vi.mock("@/components/feed/FeedCard", () => ({
  default: vi.fn(({ post }) => (
    <div data-testid="feed-card">
      Feed Card for post
      {" "}
      {post.post.id}
    </div>
  )),
}))

vi.mock("@/components/users/RandomUsers", () => ({
  default: vi.fn(() => <div data-testid="random-users">Random Users</div>),
}))

describe("FeedPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render feed page header and content", async () => {
    const { default: useFeedPosts } = await import("@/lib/hooks/posts/useFeedPosts")
    vi.mocked(useFeedPosts).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<FeedPage />)

    expect(screen.getByText("Feed Page")).toBeInTheDocument()
    expect(screen.getByText("This is the feed page content.")).toBeInTheDocument()
    expect(screen.getByTestId("random-users")).toBeInTheDocument()
  })

  it("should render feed posts when data is available", async () => {
    const mockPosts: FeedPost[] = [
      {
        post: {
          id: "1",
          title: "Test Post 1",
          content: "Test post 1 content",
          authorId: "1",
          imageUrl: null,
          isPublished: true,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
        author: {
          id: "1",
          username: "testuser1",
        },
        likes: {
          count: 0,
          isLiked: false,
        },
        comments: [],
      },
      {
        post: {
          id: "2",
          title: "Test Post 2",
          content: "Test post 2 content",
          authorId: "2",
          imageUrl: null,
          isPublished: true,
          createdAt: new Date("2024-01-02T00:00:00Z"),
          updatedAt: new Date("2024-01-02T00:00:00Z"),
        },
        author: {
          id: "2",
          username: "testuser2",
        },
        likes: {
          count: 0,
          isLiked: false,
        },
        comments: [],
      },
    ]

    const { default: useFeedPosts } = await import("@/lib/hooks/posts/useFeedPosts")
    vi.mocked(useFeedPosts).mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<FeedPage />)

    await waitFor(() => {
      expect(screen.getAllByTestId("feed-card")).toHaveLength(2)
      expect(screen.getByText("Feed Card for post 1")).toBeInTheDocument()
    })

    const feedCards = screen.getAllByTestId("feed-card")
    expect(feedCards).toHaveLength(2)
  })

  it("should render empty feed when no posts available", async () => {
    const { default: useFeedPosts } = await import("@/lib/hooks/posts/useFeedPosts")
    vi.mocked(useFeedPosts).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<FeedPage />)

    expect(screen.getByText("Feed Page")).toBeInTheDocument()
    expect(screen.queryByTestId("feed-card")).not.toBeInTheDocument()
  })

  it("should handle undefined feed posts data", async () => {
    const { default: useFeedPosts } = await import("@/lib/hooks/posts/useFeedPosts")
    vi.mocked(useFeedPosts).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<FeedPage />)

    expect(screen.getByText("Feed Page")).toBeInTheDocument()
    expect(screen.queryByTestId("feed-card")).not.toBeInTheDocument()
  })

  it("should have correct structure and styling classes", async () => {
    const { default: useFeedPosts } = await import("@/lib/hooks/posts/useFeedPosts")
    vi.mocked(useFeedPosts).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    const { container } = render(<FeedPage />)

    // Check main container
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass("min-h-screen", "bg-gray-100")

    // Check header
    const header = screen.getByRole("banner")
    expect(header).toHaveClass("text-center", "p-6", "rounded-md", "!mb-20")

    // Check main content area
    const main = screen.getByRole("main")
    expect(main).toHaveClass("flex", "flex-col", "gap-10")
  })

  it("should render header with correct hierarchy", async () => {
    const { default: useFeedPosts } = await import("@/lib/hooks/posts/useFeedPosts")
    vi.mocked(useFeedPosts).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<FeedPage />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("Feed Page")
    expect(heading).toHaveClass("text-2xl", "font-bold", "mb-4")

    const paragraph = screen.getByText("This is the feed page content.")
    expect(paragraph).toHaveClass("text-gray-600")
  })

  it("should render posts with unique keys", async () => {
    const mockPosts: FeedPost[] = [
      {
        post: {
          id: "1",
          title: "Post 1",
          content: "Post 1 content",
          authorId: "1",
          imageUrl: null,
          isPublished: true,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
        author: { id: "1", username: "user1" },
        likes: { count: 0, isLiked: false },
        comments: [],
      },
      {
        post: {
          id: "2",
          title: "Post 2",
          content: "Post 2 content",
          authorId: "2",
          imageUrl: null,
          isPublished: true,
          createdAt: new Date("2024-01-02T00:00:00Z"),
          updatedAt: new Date("2024-01-02T00:00:00Z"),
        },
        author: { id: "2", username: "user2" },
        likes: { count: 0, isLiked: false },
        comments: [],
      },
    ]

    const { default: useFeedPosts } = await import("@/lib/hooks/posts/useFeedPosts")
    vi.mocked(useFeedPosts).mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<FeedPage />)

    await waitFor(() => {
      const feedCards = screen.getAllByTestId("feed-card")
      expect(feedCards).toHaveLength(2)
      expect(screen.getByText("Feed Card for post 1")).toBeInTheDocument()
      expect(screen.getByText("Feed Card for post 2")).toBeInTheDocument()
    })
  })
})
