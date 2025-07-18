import FeedCard from "@/components/feed/FeedCard"

const dummyPosts = [
  "Post 1: Welcome to the feed!",
  "Post 2: Here's some interesting content.",
  "Post 3: Did you know about this feature?",
]

const FeedPage = () => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-4">Feed Page</h1>
        <p className="text-gray-600">This is the feed page content.</p>
        {dummyPosts.map((post, index) => (
          <FeedCard key={index} post={post} />
        ))}
      </div>
    </div>
  )
}

export default FeedPage
