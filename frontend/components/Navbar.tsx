"use client"
import { useUser } from "@/hooks/useUser"

export default function Navbar() {
  const { user, loading } = useUser()

  if (loading) return <p>Загрузка...</p>

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <span>Album</span>
      {user ? (
        <span>Привет, {user.name || user.email}</span>
      ) : (
        <a href="/auth">Войти</a>
      )}
    </nav>
  )
}