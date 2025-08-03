import { useState, useRef, useEffect } from "react"
import { NotificationsList } from "@/components/users/NotificationsList"
import useUserDataMe from "@/lib/hooks/users/useUserDataMe"
import { useNotifications } from "@/lib/hooks/notifications/useNotifications"

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: me } = useUserDataMe()
  const { data: notifications } = useNotifications(me?.id || "")
  const unreadCount = notifications?.filter(n => !n.read).length || 0

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative text-2xl mr-4 focus:outline-none"
        onClick={() => setOpen(v => !v)}
        aria-label="Zobraziť notifikácie"
      >
        <span role="img" aria-label="notifikácie">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow font-bold animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[320px] max-w-[95vw] w-[380px] z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-fade-in overflow-y-auto max-h-[70vh]">
          <h3 className="font-bold text-lg mb-2">Notifikácie</h3>
          {me?.id ? <NotificationsList userId={me.id} /> : <div>Načítavam...</div>}
        </div>
      )}
    </div>
  )
}
