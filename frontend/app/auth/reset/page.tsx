"use client"

import { useState } from "react"

const inputClass =
  "p-3 rounded-xl bg-white/20 text-white placeholder-white/60 transition"
const buttonClass =
  "rounded-xl bg-blue-500 text-white py-3 hover:bg-blue-600 transition"

export default function ResetRequestPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [statusColor, setStatusColor] = useState("text-white")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus(data.error || "Ошибка при запросе сброса пароля")
        setStatusColor("text-red-400")
      } else {
        setStatus(data.message || "Письмо отправлено. Проверьте почту.")
        setStatusColor("text-green-400")
      }
    } catch {
      setStatus("Не удалось подключиться к серверу")
      setStatusColor("text-red-400")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center text-white w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Сброс пароля</h1>
        <p className="text-white/70 text-sm mb-4">
          Введите email, и мы отправим ссылку для восстановления доступа
        </p>

        <input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass + " w-full"}
        />

        {status && <p className={`${statusColor} text-base`}>{status}</p>}

        <button
          type="submit"
          className={buttonClass + " w-full"}
          disabled={isLoading}
        >
          {isLoading ? "Отправляем..." : "Отправить ссылку"}
        </button>
      </form>
    </div>
  )
}