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
        if (data?.user) {
          setSupabaseUser({
            id: data.user.id,
            name: data.user.name ?? null,
            email: data.user.email ?? null,
            image: data.user.image ?? null,
          })
        }
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

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : supabaseUser

  return { user, loading }
}