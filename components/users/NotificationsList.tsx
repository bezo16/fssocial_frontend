import { useNotifications, useMarkNotificationRead } from "@/lib/hooks/notifications/useNotifications"

type NotificationsListProps = {
  userId: string
}

const icons: Record<string, React.ReactNode> = {
  like: <span className="text-pink-500 mr-2">❤️</span>,
  comment: <span className="text-green-500 mr-2">💬</span>,
  follow: <span className="text-yellow-500 mr-2">👤</span>,
  custom: <span className="text-gray-400 mr-2">🔔</span>,
}

export function NotificationsList({ userId }: NotificationsListProps) {
  const { data: notifications, isLoading } = useNotifications(userId)
  const markRead = useMarkNotificationRead(userId)

  if (!userId) return null
  if (isLoading) return <div>Načítavam notifikácie...</div>
  if (!notifications?.length) return <div>Žiadne notifikácie</div>

  return (
    <ul className="flex flex-col gap-4 mt-2">
      {notifications.map(n => (
        <li
          key={n.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm transition-all relative
            ${n.read
          ? "bg-white hover:bg-gray-50 border-gray-200 opacity-70"
          : "bg-blue-50 hover:bg-blue-100 border-blue-400 ring-2 ring-blue-300 opacity-100"}
          `}
          style={{ marginBottom: "0.5rem" }}
        >
          <div className="pt-1 text-2xl">{icons[n.type] ?? icons.custom}</div>
          <div className="flex-1">
            <div className={`font-medium mb-1 ${n.read ? "text-gray-500" : "text-blue-900"}`}>{n.message}</div>
            <div className="text-xs text-gray-400 mb-1">{new Date(n.createdAt).toLocaleString()}</div>
            {!n.read && (
              <button
                className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow"
                onClick={() => markRead.mutate(n.id)}
                disabled={markRead.isPending}
              >
                Označiť ako prečítané
              </button>
            )}
          </div>
          {!n.read && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
        </li>
      ))}
    </ul>
  )
}
