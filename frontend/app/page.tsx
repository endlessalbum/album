import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import GlassCard from "@/components/GlassCard"
import PartnerCard from "@/components/PartnerCard"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // 🔐 если пользователь не авторизован → на /auth
  if (!session) {
    redirect("/auth")
  }

  return (
    <div className="min-h-screen flex items-start justify-center gap-8 px-6 py-10">

      {/* Левая колонка */}
      <aside className="w-[280px] space-y-6">
        {/* ✅ динамический партнёр */}
        <PartnerCard />

        <GlassCard>
          <h2 className="text-lg font-semibold">Напоминания</h2>
          <ul className="mt-3 text-sm space-y-1">
            <li>Годовщина через 3 дня</li>
            <li>День рождения через 12 дней</li>
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold">Пасхалки</h2>
          <p className="mt-3 text-sm text-white/70">
            Сегодня месяц назад: ваша первая публикация
          </p>
        </GlassCard>
      </aside>

      {/* Правая колонка (лента) */}
      <main className="flex-1 max-w-2xl space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Главная</h1>
          <p className="text-white/70">
            Здесь будет дашборд с цитатами, фото и напоминаниями.
          </p>
        </div>

        <GlassCard>
          <p className="text-lg">
            "Любовь — это когда счастье другого важнее собственного."
          </p>
          <span className="block mt-2 text-xs text-white/50">
            Добавлено: 28.08.2025
          </span>
        </GlassCard>

        <GlassCard>
          <Image
            src="/demo-photo.jpg"
            alt="photo"
            width={600}
            height={400}
            className="rounded-xl"
          />
          <span className="block mt-2 text-xs text-white/50">
            Фото с прогулки
          </span>
        </GlassCard>

        <GlassCard>
          <video controls className="w-full rounded-xl">
            <source src="/demo-video.mp4" type="video/mp4" />
          </video>
          <span className="block mt-2 text-xs text-white/50">
            10 секундное видео
          </span>
        </GlassCard>
      </main>
    </div>
  )
}
