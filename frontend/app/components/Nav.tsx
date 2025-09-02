"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, X } from "lucide-react"

export default function Nav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const publicLinks =
    pathname === "/about"
      ? [{ href: "/auth", label: "Назад" }]
      : [{ href: "/about", label: "О нас" }]

  const privateLinks = [
    { href: "/", label: "Главная" },
    { href: "/memories", label: "Воспоминания" },
    { href: "/settings", label: "Настройки" },
  ]

  const links = session ? privateLinks : publicLinks

  return (
    <div className="relative">
      {/* Десктопная навигация */}
      <nav className="hidden md:flex gap-6 text-base font-medium items-center">
        {links.map(({ href, label }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                isActive
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </Link>
          )
        })}
        {session && (
          <>
            <span className="ml-2 text-white/80">
              Привет, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="ml-4 text-white/70 hover:text-white transition-colors"
            >
              Выйти
            </button>
          </>
        )}
      </nav>

      {/* Мобильная кнопка */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay + мобильное меню */}
      {open && (
        <>
          {/* Полупрозрачный фон */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Само меню */}
          <div className="fixed right-4 top-16 z-50 bg-black/90 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col gap-4 md:hidden w-56">
            {links.map(({ href, label }) => {
              const isActive =
                pathname === href || (href !== "/" && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`transition-colors ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              )
            })}
            {session && (
              <>
                <span className="text-white/80">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => {
                    setOpen(false)
                    signOut()
                  }}
                  className="text-left text-white/70 hover:text-white transition-colors"
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}