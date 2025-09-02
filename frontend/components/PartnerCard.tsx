"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import GlassCard from "@/components/GlassCard"

type Partner = {
  id: string
  name: string | null
  email: string
  avatar_url: string | null
}

export default function PartnerCard() {
  const [partner, setPartner] = useState<Partner | null>(null)
  const [waitingFor, setWaitingFor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  async function fetchPartner() {
    try {
      const res = await fetch("/api/partner")
      const data = await res.json()

      if (data.partner) {
        setPartner(data.partner)
      } else if (data.waitingFor) {
        setWaitingFor(data.waitingFor)
      }
    } catch (e) {
      console.error("Ошибка загрузки партнёра:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartner()
  }, [])

  async function savePartnerEmail(e: React.FormEvent) {
    e.preventDefault()
    setStatus("")

    const res = await fetch("/api/partner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner_email: email }),
    })

    const data = await res.json()
    if (data.success) {
      setStatus("Email партнёра сохранён!")
      setWaitingFor(email)
      setEmail("")
    } else {
      setStatus("Ошибка: " + (data.error || "Неизвестная"))
    }
  }

  if (loading) {
    return (
      <GlassCard>
        <p className="text-sm text-white/70">Загрузка...</p>
      </GlassCard>
    )
  }

  if (partner) {
    return (
      <GlassCard>
        <h2 className="text-lg font-semibold">Партнёр</h2>
        <div className="mt-4 relative w-20 h-20 mx-auto">
          <Image
            src={partner.avatar_url || "/default-avatar.png"}
            alt={partner.name || partner.email}
            fill
            className="rounded-full object-cover"
          />
          <div className="absolute inset-0 rounded-full ring-4 ring-green-400/70 animate-pulse" />
        </div>
        <p className="mt-3 text-sm text-center font-medium">
          {partner.name || partner.email}
        </p>
        <p className="text-xs text-center text-white/60">Сейчас онлайн</p>
      </GlassCard>
    )
  }

  if (waitingFor) {
    return (
      <GlassCard>
        <h2 className="text-lg font-semibold">Партнёр</h2>
        <p className="mt-2 text-sm text-white/70">
          Ожидание регистрации: <span className="font-medium">{waitingFor}</span>
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">Добавить партнёра</h2>
      <form onSubmit={savePartnerEmail} className="mt-3 space-y-3">
        <input
          type="email"
          placeholder="Email партнёра"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/50"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Сохранить
        </button>
      </form>
      {status && <p className="text-xs mt-2">{status}</p>}
    </GlassCard>
  )
}
