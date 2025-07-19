"use client"
import { useParams } from "next/navigation"

const UserProfilePage = () => {
  const params = useParams<{ id: string }>()
  const id = params?.id
  return (
    <div>
      <h1>User Profile Page</h1>
      <p>
        User ID:
        {id}
      </p>
      {/* Additional content can be added here */}
    </div>
  )
}

export default UserProfilePage
