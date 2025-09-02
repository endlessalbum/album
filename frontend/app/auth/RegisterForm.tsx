"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const inputClass =
  "p-3 rounded-xl bg-white/20 text-white placeholder-white/60 transition"
const buttonClass =
  "rounded-xl bg-blue-500 text-white py-3 hover:bg-blue-600 transition"

export default function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState("")
  const [statusColor, setStatusColor] = useState("text-white")
  const [passwordError, setPasswordError] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (confirmPassword && password === confirmPassword) {
      setPasswordError(false)
      setPasswordSuccess(true)
      setStatus("")
    } else {
      setPasswordSuccess(false)
    }
  }, [password, confirmPassword])

  // Проверка сложности пароля
  function isPasswordStrong(pw: string) {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    return strongRegex.test(pw)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setStatus("")
    setPasswordError(false)
    setEmailError(false)

    // Валидация имени
    if (name.trim().length < 2) {
      setStatus("Имя должно содержать минимум 2 символа")
      setStatusColor("text-red-400")
      return
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("Введите корректный email")
      setStatusColor("text-red-400")
      return
    }

    // Валидация пароля
    if (!isPasswordStrong(password)) {
      setStatus("Пароль должен быть минимум 8 символов, с цифрой и заглавной буквой")
      setStatusColor("text-red-400")
      return
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setStatus("Пароли не совпадают")
      setStatusColor("text-red-400")
      setPasswordError(true)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error?.toLowerCase().includes("email")) {
          setEmailError(true)
          setStatus("Почта уже зарегистрирована")
        } else {
          setStatus("Ошибка: " + (data.error || "Не удалось зарегистрироваться"))
        }
        setStatusColor("text-red-400")
        return
      }

      // Успех
      setStatus(data.message || "Проверьте почту для подтверждения email")
      setStatusColor("text-green-400")

      // через 2 секунды — редирект
      setTimeout(() => router.push("/auth?page=login"), 2000)
    } catch {
      setStatus("Не удалось подключиться к серверу")
      setStatusColor("text-red-400")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass + " w-full"}
      />

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailError(false)
          }}
          className={`${inputClass} w-full ${
            emailError ? "border-2 border-red-500 animate-pulse" : ""
          }`}
        />
      </div>

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`${inputClass} w-full ${
          passwordError
            ? "border-2 border-red-500 animate-pulse"
            : passwordSuccess
            ? "border-2 border-green-500"
            : ""
        }`}
      />
      <input
        type="password"
        placeholder="Подтверждение пароля"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={`${inputClass} w-full ${
          passwordError
            ? "border-2 border-red-500 animate-pulse"
            : passwordSuccess
            ? "border-2 border-green-500"
            : ""
        }`}
      />

      {status && <p className={`${statusColor} text-base`}>{status}</p>}

      <button type="submit" className={buttonClass + " w-full"} disabled={isLoading}>
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  )
}