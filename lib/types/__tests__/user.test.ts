import { describe, it, expect } from "vitest"
import type { UserProfileDto, UserPreviewDto } from "../user"

describe("User Types", () => {
  describe("UserProfileDto", () => {
    it("should have all required properties", () => {
      const user: UserProfileDto = {
        id: "123",
        username: "testuser",
        email: "test@example.com",
        password_hash: "hashed",
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2023-01-02"),
        followsCount: 5,
        isFollowed: false,
      }

      expect(user.id).toBe("123")
      expect(user.username).toBe("testuser")
      expect(user.email).toBe("test@example.com")
      expect(user.password_hash).toBe("hashed")
      expect(user.created_at).toBeInstanceOf(Date)
      expect(user.updated_at).toBeInstanceOf(Date)
      expect(user.followsCount).toBe(5)
      expect(user.isFollowed).toBe(false)
    })

    it("should allow optional avatarUrl property", () => {
      const userWithAvatar: UserProfileDto = {
        id: "123",
        username: "testuser",
        email: "test@example.com",
        password_hash: "hashed",
        avatarUrl: "/avatars/test.jpg",
        created_at: new Date(),
        updated_at: new Date(),
        followsCount: 0,
        isFollowed: false,
      }

      expect(userWithAvatar.avatarUrl).toBe("/avatars/test.jpg")

      const userWithoutAvatar: UserProfileDto = {
        id: "123",
        username: "testuser",
        email: "test@example.com",
        password_hash: "hashed",
        created_at: new Date(),
        updated_at: new Date(),
        followsCount: 0,
        isFollowed: false,
      }

      expect(userWithoutAvatar.avatarUrl).toBeUndefined()
    })

    it("should allow optional bio property", () => {
      const userWithBio: UserProfileDto = {
        id: "123",
        username: "testuser",
        email: "test@example.com",
        password_hash: "hashed",
        bio: "This is my bio",
        created_at: new Date(),
        updated_at: new Date(),
        followsCount: 0,
        isFollowed: false,
      }

      expect(userWithBio.bio).toBe("This is my bio")
    })
  })

  describe("UserPreviewDto", () => {
    it("should have all required properties", () => {
      const userPreview: UserPreviewDto = {
        id: "456",
        username: "previewuser",
        email: "preview@example.com",
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2023-01-02"),
      }

      expect(userPreview.id).toBe("456")
      expect(userPreview.username).toBe("previewuser")
      expect(userPreview.email).toBe("preview@example.com")
      expect(userPreview.created_at).toBeInstanceOf(Date)
      expect(userPreview.updated_at).toBeInstanceOf(Date)
    })

    it("should not have additional properties from UserProfileDto", () => {
      const userPreview: UserPreviewDto = {
        id: "456",
        username: "previewuser",
        email: "preview@example.com",
        created_at: new Date(),
        updated_at: new Date(),
      }

      // TypeScript should prevent these properties from existing
      // @ts-expect-error - These properties should not exist on UserPreviewDto
      expect(userPreview.password_hash).toBeUndefined()
      // @ts-expect-error - These properties should not exist on UserPreviewDto
      expect(userPreview.followsCount).toBeUndefined()
      // @ts-expect-error - These properties should not exist on UserPreviewDto
      expect(userPreview.isFollowed).toBeUndefined()
    })
  })

  describe("Type compatibility", () => {
    it("should allow UserProfileDto to be assigned to UserPreviewDto subset", () => {
      const fullUser: UserProfileDto = {
        id: "123",
        username: "testuser",
        email: "test@example.com",
        password_hash: "hashed",
        created_at: new Date(),
        updated_at: new Date(),
        followsCount: 5,
        isFollowed: false,
      }

      // This should compile without issues
      const previewUser: Pick<UserProfileDto, keyof UserPreviewDto> = {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        created_at: fullUser.created_at,
        updated_at: fullUser.updated_at,
      }

      expect(previewUser.id).toBe("123")
      expect(previewUser.username).toBe("testuser")
    })
  })
})
