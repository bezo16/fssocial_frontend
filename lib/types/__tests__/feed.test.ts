import { describe, it, expect } from "vitest"
import type { Post, FeedPost } from "../feed"

describe("Feed Types", () => {
  describe("Post", () => {
    it("should have all required properties", () => {
      const post: Post = {
        id: "post123",
        title: "Test Post",
        content: "This is test content",
        authorId: "user123",
        imageUrl: "https://example.com/image.jpg",
        isPublished: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-02"),
      }

      expect(post.id).toBe("post123")
      expect(post.title).toBe("Test Post")
      expect(post.content).toBe("This is test content")
      expect(post.authorId).toBe("user123")
      expect(post.imageUrl).toBe("https://example.com/image.jpg")
      expect(post.isPublished).toBe(true)
      expect(post.createdAt).toBeInstanceOf(Date)
      expect(post.updatedAt).toBeInstanceOf(Date)
    })

    it("should allow null content", () => {
      const post: Post = {
        id: "post123",
        title: "Test Post",
        content: null,
        authorId: "user123",
        imageUrl: null,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(post.content).toBeNull()
      expect(post.imageUrl).toBeNull()
      expect(post.isPublished).toBe(false)
    })

    it("should handle different data types correctly", () => {
      const now = new Date()
      const post: Post = {
        id: "1",
        title: "",
        content: "",
        authorId: "author1",
        imageUrl: "",
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      }

      expect(typeof post.id).toBe("string")
      expect(typeof post.title).toBe("string")
      expect(typeof post.authorId).toBe("string")
      expect(typeof post.isPublished).toBe("boolean")
      expect(post.createdAt).toBeInstanceOf(Date)
      expect(post.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe("FeedPost", () => {
    it("should have all required nested properties", () => {
      const feedPost: FeedPost = {
        post: {
          id: "post123",
          title: "Feed Test Post",
          content: "This is feed content",
          authorId: "user123",
          imageUrl: "https://example.com/feed-image.jpg",
          isPublished: true,
          createdAt: new Date("2023-01-01"),
          updatedAt: new Date("2023-01-02"),
        },
        author: {
          id: "user123",
          username: "testuser",
        },
        likes: {
          count: 5,
          isLiked: true,
        },
        comments: [
          {
            id: "comment1",
            userId: "user456",
            targetType: "post",
            targetId: "post123",
            content: "Great post!",
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-01-01"),
            author: {
              id: "user456",
              username: "commenter",
            },
          },
        ],
      }

      // Test post properties
      expect(feedPost.post.id).toBe("post123")
      expect(feedPost.post.title).toBe("Feed Test Post")
      expect(feedPost.post.content).toBe("This is feed content")
      expect(feedPost.post.authorId).toBe("user123")
      expect(feedPost.post.imageUrl).toBe("https://example.com/feed-image.jpg")
      expect(feedPost.post.isPublished).toBe(true)
      expect(feedPost.post.createdAt).toBeInstanceOf(Date)
      expect(feedPost.post.updatedAt).toBeInstanceOf(Date)

      // Test author properties
      expect(feedPost.author.id).toBe("user123")
      expect(feedPost.author.username).toBe("testuser")

      // Test likes properties
      expect(feedPost.likes.count).toBe(5)
      expect(feedPost.likes.isLiked).toBe(true)

      // Test comments properties
      expect(feedPost.comments).toHaveLength(1)
      expect(feedPost.comments![0].id).toBe("comment1")
      expect(feedPost.comments![0].content).toBe("Great post!")
      expect(feedPost.comments![0].author.username).toBe("commenter")
    })

    it("should handle zero likes and not liked state", () => {
      const feedPost: FeedPost = {
        post: {
          id: "post456",
          title: "No Likes Post",
          content: null,
          authorId: "user456",
          imageUrl: null,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        author: {
          id: "user456",
          username: "nolikes",
        },
        likes: {
          count: 0,
          isLiked: false,
        },
        comments: null,
      }

      expect(feedPost.post.content).toBeNull()
      expect(feedPost.post.imageUrl).toBeNull()
      expect(feedPost.likes.count).toBe(0)
      expect(feedPost.likes.isLiked).toBe(false)
      expect(feedPost.comments).toBeNull()
    })

    it("should handle high like counts", () => {
      const feedPost: FeedPost = {
        post: {
          id: "viral-post",
          title: "Viral Post",
          content: "This went viral!",
          authorId: "influencer",
          imageUrl: "https://example.com/viral.jpg",
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        author: {
          id: "influencer",
          username: "viral_influencer",
        },
        likes: {
          count: 999999,
          isLiked: true,
        },
        comments: [],
      }

      expect(feedPost.likes.count).toBe(999999)
      expect(typeof feedPost.likes.count).toBe("number")
    })

    it("should ensure author id matches post authorId relationship", () => {
      const authorId = "consistent-user"
      const feedPost: FeedPost = {
        post: {
          id: "consistency-test",
          title: "Consistency Test",
          content: "Testing relationship",
          authorId: authorId,
          imageUrl: null,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        author: {
          id: authorId,
          username: "consistent_user",
        },
        likes: {
          count: 1,
          isLiked: false,
        },
        comments: [],
      }

      expect(feedPost.post.authorId).toBe(feedPost.author.id)
    })

    it("should handle multiple comments with different authors", () => {
      const feedPost: FeedPost = {
        post: {
          id: "popular-post",
          title: "Popular Post",
          content: "This has many comments",
          authorId: "author1",
          imageUrl: null,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        author: {
          id: "author1",
          username: "popular_author",
        },
        likes: {
          count: 10,
          isLiked: true,
        },
        comments: [
          {
            id: "comment1",
            userId: "user1",
            targetType: "post",
            targetId: "popular-post",
            content: "First comment!",
            createdAt: new Date(),
            updatedAt: new Date(),
            author: {
              id: "user1",
              username: "first_commenter",
            },
          },
          {
            id: "comment2",
            userId: "user2",
            targetType: "post",
            targetId: "popular-post",
            content: "Second comment!",
            createdAt: new Date(),
            updatedAt: new Date(),
            author: {
              id: "user2",
              username: "second_commenter",
            },
          },
        ],
      }

      expect(feedPost.comments).toHaveLength(2)
      expect(feedPost.comments![0].author.username).toBe("first_commenter")
      expect(feedPost.comments![1].author.username).toBe("second_commenter")
    })
  })
})
