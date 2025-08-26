import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "@/components/ui/provider"
import FeedCard from "../FeedCard"
import type { FeedPost } from "@/lib/types/feed"

// Mock Next.js components
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("next/image", () => ({
  default: ({ src, alt, width, height }: { src: string, alt: string, width: number, height: number }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))

// Mock hooks
vi.mock("@/lib/hooks/likes/useLikePost", () => ({
  default: () => ({
    mutateAsync: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/likes/useUnlikePost", () => ({
  default: () => ({
    mutateAsync: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/comments/useCreateComment", () => ({
  default: () => ({
    mutateAsync: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/comments/useDeleteComment", () => ({
  default: () => ({
    mutateAsync: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/users/useUserDataMe", () => ({
  default: () => ({
    data: {
      id: "user123",
      username: "testuser",
    },
  }),
}))

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

const mockPost: FeedPost = {
  post: {
    id: "post123",
    title: "Test Post Title",
    content: "This is test post content",
    authorId: "author123",
    imageUrl: "/test-image.jpg",
    isPublished: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  author: {
    id: "author123",
    username: "testauthor",
  },
  likes: {
    count: 5,
    isLiked: false,
  },
  comments: [
    {
      id: "comment123",
      userId: "commenter123",
      targetType: "post",
      targetId: "post123",
      content: "Test comment",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
      author: {
        id: "commenter123",
        username: "commenter",
      },
    },
  ],
}

describe("FeedCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders post title and content", () => {
    render(
      <FeedCard post={mockPost} />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText("Test Post Title")).toBeInTheDocument()
    expect(screen.getByText("This is test post content")).toBeInTheDocument()
  })

  it("displays author username", () => {
    render(
      <FeedCard post={mockPost} />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText("testauthor")).toBeInTheDocument()
  })

  it("shows like count", () => {
    render(
      <FeedCard post={mockPost} />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("renders image when imageUrl is provided", () => {
    render(
      <FeedCard post={mockPost} />,
      { wrapper: createWrapper() },
    )

    const image = screen.getByAltText("Test Post Title")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/test-image.jpg")
  })

  it("does not render image when imageUrl is null", () => {
    const postWithoutImage = {
      ...mockPost,
      post: {
        ...mockPost.post,
        imageUrl: null,
      },
    }

    render(
      <FeedCard post={postWithoutImage} />,
      { wrapper: createWrapper() },
    )

    expect(screen.queryByAltText("Test Post Title")).not.toBeInTheDocument()
  })

  it("displays comments", () => {
    render(
      <FeedCard post={mockPost} />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByText("Test comment")).toBeInTheDocument()
    expect(screen.getByText("@commenter")).toBeInTheDocument()
  })

  it("shows comment form", () => {
    render(
      <FeedCard post={mockPost} />,
      { wrapper: createWrapper() },
    )

    expect(screen.getByLabelText("Napíš komentár")).toBeInTheDocument()
    expect(screen.getByText("Odoslať komentár")).toBeInTheDocument()
  })

  it("renders like button with correct aria-label", () => {
    render(
      <FeedCard post={mockPost} />,
      { wrapper: createWrapper() },
    )

    // The button shows "Unlike" since mockPost.isLiked is true by default
    const likeButton = screen.getByLabelText("Unlike")
    expect(likeButton).toBeInTheDocument()
  })

  it("handles empty comments array", () => {
    const postWithoutComments = {
      ...mockPost,
      comments: [],
    }

    render(
      <FeedCard post={postWithoutComments} />,
      { wrapper: createWrapper() },
    )

    expect(screen.queryByText("Komentáre")).not.toBeInTheDocument()
  })
})
