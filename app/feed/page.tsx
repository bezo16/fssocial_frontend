import FeedCard from "@/components/feed/FeedCard"
import RandomUsers from "@/components/users/RandomUsers"

const FeedPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="text-center p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-4">Feed Page</h1>
        <p className="text-gray-600">This is the feed page content.</p>
        <RandomUsers />
      </header>
      <main>
        <FeedCard post="just dummy post" />
      </main>
    </div>
  )
}

export default FeedPage
