import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { handlePrismaError } from "@/app/utils/prisma-error"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // нужен сервисный ключ
)

interface RegisterRequest {
  email: string
  password: string
  name?: string
  invite: string
}

export async function POST(req: Request) {
  try {
    const { email, password, name, invite }: RegisterRequest = await req.json()

    if (!email || !password || !invite) {
      return NextResponse.json(
        { error: "Email, пароль и инвайт обязательны" },
        { status: 400 }
      )
    }

    // Проверяем инвайт
    const existingInvite = await prisma.invites.findUnique({
      where: { code: invite },
    })

    if (!existingInvite) {
      return NextResponse.json({ error: "Инвайт недействителен" }, { status: 400 })
    }

    if (existingInvite.expires_at && existingInvite.expires_at < new Date()) {
      return NextResponse.json({ error: "Инвайт просрочен" }, { status: 410 })
    }

    if (existingInvite.used_by) {
      return NextResponse.json({ error: "Инвайт уже использован" }, { status: 409 })
    }

    // Проверяем пользователя
    const existingUser = await prisma.profiles.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Такой пользователь уже существует" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)

    // Создаём профиль
    const user = await prisma.profiles.create({
      data: {
        email,
        username: name ?? null,
        encrypted_password: hashedPassword,
        avatar_url: null,
      },
    })

    // Обновляем инвайт (помечаем использованным)
    await prisma.invites.update({
      where: { code: invite },
      data: {
        used_by: user.id,
        used_at: new Date(),
      },
    })

    // Регистрируем в Supabase Auth
    const { error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm`,
      },
    })

    if (supabaseError) {
      console.error("Supabase error:", supabaseError.message)
      return NextResponse.json(
        { error: "Ошибка при отправке письма подтверждения" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Пользователь создан. Проверьте почту для подтверждения email." },
      { status: 201 }
    )
  } catch (err: unknown) {
    return handlePrismaError(err)
  }
}