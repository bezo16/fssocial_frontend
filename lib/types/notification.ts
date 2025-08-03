export type NotificationType = "like" | "comment" | "follow" | "custom"

export type Notification = {
  id: string
  toUserId: string
  fromUserId: string
  type: NotificationType
  message: string
  read: boolean
  createdAt: string
}
