"use client"

import { useState } from "react"
import Image from "next/image"
import GlassCard from "@/components/GlassCard"
import TabSwitcher from "@/components/TabSwitcher"
import { signIn } from "next-auth/react"
import { Tab } from "@/types/tabs"

import RegisterForm from "./RegisterForm"
import InviteForm from "./InviteForm"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/50"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/50"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
      >
        Войти
      </button>
    </form>
  )
}

export default function AuthPage() {
  const [active, setActive] = useState<Tab>("Войти")

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div
        className="flex flex-col-reverse md:flex-row items-center justify-center 
                      gap-8 md:gap-16 px-6 py-8 
                      w-full max-w-6xl mx-auto"
      >
        {/* Левый блок — промо */}
        <div className="w-full max-w-sm flex justify-center md:justify-end">
          <GlassCard className="w-full">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="logo" width={60} height={60} />
              <h1 className="text-base font-bold">Endlessalbum</h1>
            </div>
            <p className="mt-4 text-white/70 text-base">
              — это пространство для двоих.  
              Делитесь историями, мечтами и воспоминаниями.  
              Всё хранится в бесконечном альбоме навсегда!
            </p>
          </GlassCard>
        </div>

        {/* Правый блок — формы */}
        <div className="w-full max-w-sm flex justify-center md:justify-start">
          <div className="w-full">
            <TabSwitcher active={active} setActive={setActive} />
            <GlassCard className="mt-6 w-full">
              {active === "Войти" && <LoginForm />}
              {active === "Регистрация" && <RegisterForm />}
              {active === "Инвайт" && <InviteForm />}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}