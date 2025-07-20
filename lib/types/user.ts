export type UserProfileDto = {
  id: string
  username: string
  email: string
  password_hash: string
  created_at: Date
  updated_at: Date
  followsCount: number
  isFollowed: boolean
}

export type UserPreviewDto = {
  id: string
  username: string
  email: string
  created_at: Date
  updated_at: Date
}
