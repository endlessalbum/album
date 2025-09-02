"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"

const inputClass =
  "p-3 rounded-xl bg-white/20 text-white placeholder-white/60 transition"
const buttonClass =
  "rounded-xl bg-blue-500 text-white py-3 hover:bg-blue-600 transition"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")
    setEmailError(false)
    setPasswordError(false)

    //Проверка формата email до отправки
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("Введите корректный email")
      setLoading(false)
      return
    }

    // Проверка на пустые поля (обработка того, что уже есть в authorize)
    if (!email || !password) {
      setStatus("Введите email и пароль")
      setLoading(false)
      return
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      if (result.error === "user_not_found") {
        setEmailError(true)
        setStatus("Пользователь не найден")
      } else if (result.error === "invalid_password") {
        setPasswordError(true)
        setStatus("Пароль неверный")
        setTimeout(() => setPasswordError(false), 1200)
      } else {
        setStatus("Ошибка: " + result.error)
      }
      setLoading(false)
      return
    }

    // Успешный вход
    window.location.href = "/"
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClass} w-full ${emailError ? "border-2 border-red-500" : ""}`}
        />
        {emailError && (
          <p className="text-red-400 text-base">Пользователь не найден</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClass} w-full ${
            passwordError ? "border-2 border-red-500 animate-pulse" : ""
          }`}
        />
        {passwordError && (
          <p className="text-red-400 text-base">Пароль неверный</p>
        )}
      </div>

      {status && <p className="text-red-400 text-base">{status}</p>}

      <button
        type="submit"
        className={buttonClass + " w-full"}
        disabled={loading}
      >
        {loading ? "Вход..." : "Войти"}
      </button>

      {/*Кнопка "Забыли пароль?" */}
      <p className="text-base text-white/70 text-center mt-2">
        <a href="/auth/reset" className="hover:underline">
          Забыли пароль?
        </a>
      </p>
    </form>
  )
}