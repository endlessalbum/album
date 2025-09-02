import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // сервисный ключ
)

interface InviteLoginRequest {
  email: string
  password: string
  invite: string
}

export async function POST(req: Request) {
  try {
    const { email, password, invite }: InviteLoginRequest = await req.json()

    if (!email || !password || !invite) {
      return NextResponse.json(
        { error: "Email, пароль и инвайт обязательны" },
        { status: 400 }
      )
    }

    // Проверяем инвайт
    const existing = await prisma.invites.findUnique({ where: { code: invite } })

    if (!existing) {
      return NextResponse.json({ error: "Инвайт недействителен" }, { status: 404 })
    }
    if (existing.expires_at && existing.expires_at < new Date()) {
      return NextResponse.json({ error: "Инвайт просрочен" }, { status: 410 })
    }
    if (existing.used_by) {
      return NextResponse.json({ error: "Инвайт уже использован" }, { status: 409 })
    }

    // Логиним через Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      console.error("Supabase login error:", error?.message)
      return NextResponse.json(
        { error: error?.message || "Ошибка входа" },
        { status: 401 }
      )
    }

    // Помечаем инвайт как использованный
    await prisma.invites.update({
      where: { code: invite },
      data: {
        used_by: data.user.id,
        used_at: new Date(),
      },
    })

    // Создаём ответ
    const res = NextResponse.json({
      success: true,
      user: data.user,
    })

    // Устанавливаем httpOnly secure куки
    res.cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: data.session.expires_in, // в секундах
    })

    res.cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    })

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}