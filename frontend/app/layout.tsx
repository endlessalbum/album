// frontend/app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import { ReactNode } from "react"
import Image from "next/image"
import Nav from "./components/Nav"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Endlessalbum",
  description: "Endless — пространство для двоих.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body
        className={`min-h-screen flex flex-col text-white ${inter.className}`}
      >
        <Providers>
          {/* Шапка */}
          <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-md">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="logo" width={40} height={40} />
                <h1 className="text-xl font-bold tracking-wide">
                  Endlessalbum
                </h1>
              </div>
              <Nav />
            </div>
          </header>

          {/* Контент */}
          <main className="flex-1 w-full">{children}</main>

          {/* Футер */}
          <footer className="bg-white/5 border-t border-white/20 py-6 text-center text-sm text-white/50">
            © {new Date().getFullYear()} Endlessalbum · Сделано с любовью · Все
            права защищены
          </footer>
        </Providers>
      </body>
    </html>
  )
}