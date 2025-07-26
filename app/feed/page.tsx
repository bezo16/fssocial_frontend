"use client"
import FeedCard from "@/components/feed/FeedCard"
import RandomUsers from "@/components/users/RandomUsers"
import useFeedPosts from "@/lib/hooks/posts/useFeedPosts"

const FeedPage = () => {
  const { data: feedPosts } = useFeedPosts()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="text-center p-6 rounded-md !mb-20">
        <h1 className="text-2xl font-bold mb-4">Feed Page</h1>
        <p className="text-gray-600">This is the feed page content.</p>
        <RandomUsers />
      </header>
      <main className="flex flex-col gap-10">
        {feedPosts && feedPosts.map(post => (
          <FeedCard key={post.post.id} post={post} />
        ))}
      </main>
    </div>
  )
}

export default FeedPage
