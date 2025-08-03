import { NotificationsList } from "@/components/users/NotificationsList"
import useUserDataMe from "@/lib/hooks/users/useUserDataMe"

export default function NotificationsSection() {
  const { data: me, isLoading } = useUserDataMe()
  if (isLoading) return null
  if (!me?.id) return null
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-2">Notifikácie</h2>
      <NotificationsList userId={me.id} />
    </section>
  )
}
