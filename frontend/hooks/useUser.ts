// frontend/hooks/useUser.ts
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface User {
  id: string
  email: string | null
  name?: string | null
  image?: string | null
}

export function useUser() {
  const { data: session, status } = useSession()
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSupabaseUser() {
      try {
        const res = await fetch("/api/me")
        const data = await res.json()
        setSupabaseUser(data.user)
      } catch (err) {
        console.error("useUser supabase fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (status === "loading") {
      setLoading(true)
      return
    }

    if (status === "authenticated") {
      setLoading(false)
    } else {
      fetchSupabaseUser()
    }
  }, [status])

  const user: User | null =
    session?.user ?? supabaseUser ?? null

  return { user, loading }
}