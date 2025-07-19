"use client"
import CreatePostForm from "@/components/posts/CreatePostForm"
import useProfilePostsMe from "@/lib/hooks/useProfilePostsMe"

export default function BlogPostPage() {
  const { data: posts } = useProfilePostsMe()

  return (
    <div className="!p-4">
      <header>
        <CreatePostForm />
      </header>
      <main className="flex flex-col items-center">
        {posts?.map(post => (
          <div key={post.id} className="border-b border-gray-200 !my-10">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-gray-500">
              Author ID:
              {post.authorId}
            </p>
            <p className="text-sm text-gray-500">
              Created at:
              {new Date(post.createdAt).toLocaleString()}
            </p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="mt-2" />}
          </div>
        ))}
      </main>
    </div>
  )
}
