"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import GlassCard from "@/components/GlassCard"

interface Invite {
  id: string
  code: string
  used_by: string | null
  created_at: string
}

export default function AdminInvites({ userId }: { userId: string }) {
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Проверка роли пользователя
  const checkRole = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (!error && data?.role === "admin") {
      setIsAdmin(true)
    }
  }

  // Загрузка инвайтов текущего пользователя
  const fetchInvites = async () => {
    const { data, error } = await supabase
      .from("invites")
      .select("*")
      .eq("owner", userId)
      .order("created_at", { ascending: false })

    if (!error && data) setInvites(data)
  }

  useEffect(() => {
    checkRole()
    fetchInvites()
  }, [])

  // Генерация нового кода
  const generateInvite = async () => {
    setLoading(true)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()

    const { data, error } = await supabase
      .from("invites")
      .insert({ code, owner: userId })
      .select()

    if (!error && data) {
      setInvites([data[0], ...invites])
    }
    setLoading(false)
  }

  // Копирование кода в буфер
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Инвайт скопирован: " + text)
  }

  if (!isAdmin) {
    return (
      <GlassCard>
        <p className="text-white/60">У вас нет прав для управления инвайтами</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <h2 className="text-base font-semibold mb-4">Инвайты</h2>

      <button
        onClick={generateInvite}
        disabled={loading}
        className="mb-4 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        {loading ? "Создаём..." : "Создать новый инвайт"}
      </button>

      {invites.length === 0 ? (
        <p className="text-white/60">Пока нет инвайтов</p>
      ) : (
        <ul className="space-y-3">
          {invites.map((inv) => (
            <li
              key={inv.id}
              className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2"
            >
              <div>
                <p className="font-mono">{inv.code}</p>
                <p className="text-base text-white/50">
                  {inv.used_by ? `Использован (пользователь ${inv.used_by})` : "Не использован"}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(inv.code)}
                className="px-3 py-1 rounded-lg bg-blue-400 text-base text-white hover:bg-blue-500"
              >
                Копировать
              </button>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}