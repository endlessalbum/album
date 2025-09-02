// frontend/app/settings/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth")

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <p>Аккаунт: {session.user?.email}</p>
    </div>
  )
}
