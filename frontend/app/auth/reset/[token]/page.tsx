"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const inputClass =
  "p-3 rounded-xl bg-white/20 text-white placeholder-white/60 transition"
const buttonClass =
  "rounded-xl bg-blue-500 text-white py-3 hover:bg-blue-600 transition"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const { token } = params
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState("")
  const [statusColor, setStatusColor] = useState("text-white")
  const [isLoading, setIsLoading] = useState(false)

  function isPasswordStrong(pw: string) {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    return strongRegex.test(pw)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("")

    if (!isPasswordStrong(password)) {
      setStatus("Пароль должен быть минимум 8 символов, с цифрой и заглавной буквой")
      setStatusColor("text-red-400")
      return
    }

    if (password !== confirmPassword) {
      setStatus("Пароли не совпадают")
      setStatusColor("text-red-400")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("Ошибка: " + (data.error || "Не удалось обновить пароль"))
        setStatusColor("text-red-400")
        return
      }

      setStatus("Пароль успешно обновлён! Перенаправляем на вход...")
      setStatusColor("text-green-400")
      setTimeout(() => router.push("/auth?page=login"), 2000)
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

        <input
          type="password"
          placeholder="Новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass + " w-full"}
        />
        <input
          type="password"
          placeholder="Подтверждение пароля"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass + " w-full"}
        />

        {status && <p className={`${statusColor} text-base`}>{status}</p>}

        <button type="submit" className={buttonClass + " w-full"} disabled={isLoading}>
          {isLoading ? "Сохраняем..." : "Обновить пароль"}
        </button>
      </form>
    </div>
  )
}