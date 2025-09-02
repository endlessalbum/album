// frontend/app/memories/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function MemoriesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth")

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">Воспоминания</h1>
      <p>Привет, {session.user?.email}!</p>
    </div>
  )
}
