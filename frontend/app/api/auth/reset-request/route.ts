import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import crypto from "crypto"
import { sendMail } from "@/app/utils/mailer" // ✉️ тут твой модуль для отправки писем

const RESET_TOKEN_EXPIRATION_HOURS = 1

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      )
    }

    // проверяем, что пользователь существует
    const user = await prisma.profiles.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь с таким email не найден" },
        { status: 404 }
      )
    }

    // генерируем токен
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000)

    // удаляем старые токены
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // сохраняем новый
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    // генерируем ссылку
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset/confirm?token=${token}`

    // шлём письмо
    await sendMail({
      to: email,
      subject: "Сброс пароля",
      html: `
        <p>Здравствуйте, ${user.username || "пользователь"}!</p>
        <p>Вы запросили сброс пароля. Перейдите по ссылке ниже, чтобы задать новый пароль:</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Ссылка действует ${RESET_TOKEN_EXPIRATION_HOURS} час.</p>
      `,
    })

    return NextResponse.json(
      { message: "Письмо со ссылкой для сброса пароля отправлено" },
      { status: 200 }
    )
  } catch (err) {
    console.error("Reset request error:", err)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}