"use client"
import FeedCard from "@/components/feed/FeedCard"
import RandomUsers from "@/components/users/RandomUsers"
import useFeedPosts from "@/lib/hooks/useFeedPosts"

const FeedPage = () => {
  const { data: feedPosts } = useFeedPosts()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="text-center p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-4">Feed Page</h1>
        <p className="text-gray-600">This is the feed page content.</p>
        <RandomUsers />
      </header>
      <main>
        {feedPosts && feedPosts.map(post => (
          <FeedCard key={post.post.id} post={post} />
        ))}
      </main>
    </div>
  )
}

export default FeedPage
