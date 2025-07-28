"use client"
import EditAvatarSection from "@/components/users/EditAvatarSection"
import CreatePostForm from "@/components/posts/CreatePostForm"
import useProfilePostsMe from "@/lib/hooks/posts/useProfilePostsMe"
import EditProfileSection from "@/components/users/EditProfileSection"
import ProfileAvatarSection from "@/components/users/ProfileAvatarSection"
import Image from "next/image"

export default function BlogPostPage() {
  const { data: posts } = useProfilePostsMe()
  return (
    <div className="!p-4">
      <header>
        <CreatePostForm />
      </header>
      <main className="flex flex-col items-center">
        <ProfileAvatarSection />
        <EditAvatarSection />
        <EditProfileSection />
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
            {post.imageUrl && (
              <Image src={post.imageUrl} alt={post.title} width={320} height={320} className="mt-2" style={{ objectFit: "cover", borderRadius: "16px" }} />
            )}
          </div>
        ))}
      </main>
    </div>
  )
}
