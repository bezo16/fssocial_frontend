export type Post = {
  id: string
  title: string
  content: string | null
  authorId: string
  imageUrl: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export type FeedPost = {
  post: {
    id: string
    title: string
    content: string | null
    authorId: string
    imageUrl: string | null
    isPublished: boolean
    createdAt: Date
    updatedAt: Date
  }
  author: {
    id: string
    username: string
  }
}
