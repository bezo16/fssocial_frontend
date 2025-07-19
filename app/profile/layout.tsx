import NavigationBar from "@/components/common/NavigationBar"

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full">
        <NavigationBar />
      </header>
      <main className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        {children}
      </main>
    </div>
  )
}

export default ProfileLayout
