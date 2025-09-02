// frontend/app/profile/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getSupabaseUser } from "@/lib/supabaseAuth"

export default async function ProfilePage() {
  // 1. Пытаемся достать пользователя через NextAuth
  const session = await getServerSession(authOptions)
  let user = session?.user

  // 2. Если нет — пробуем Supabase
  if (!user) {
    const supabaseUser = await getSupabaseUser()
    if (supabaseUser) {
      user = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || "Без имени",
      }
    }
  }

  // 3. Если оба пустые → редирект на /auth
  if (!user) {
    redirect("/auth")
  }

  // 4. Если нашли юзера → рендерим
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Профиль</h1>
      <p>ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Имя: {user.name}</p>
    </div>
  )
}