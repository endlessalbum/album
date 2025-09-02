import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Некорректный запрос" },
        { status: 400 }
      )
    }

    // проверка токена
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: "Токен не найден" },
        { status: 400 }
      )
    }

    if (resetToken.expiresAt < new Date()) {
      // сразу удаляем просроченный токен
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
      return NextResponse.json(
        { error: "Срок действия ссылки для сброса пароля истёк" },
        { status: 400 }
      )
    }

    // простая валидация пароля
    const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!strongRegex.test(password)) {
      return NextResponse.json(
        { error: "Пароль должен быть минимум 8 символов, с цифрой и заглавной буквой" },
        { status: 400 }
      )
    }

    // хэшируем и сохраняем
    const hashed = await hash(password, 10)
    await prisma.profiles.update({
      where: { id: resetToken.userId },
      data: { encrypted_password: hashed },
    })

    // удаляем токен, чтобы нельзя было использовать повторно
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })

    return NextResponse.json(
      { message: "Пароль успешно обновлён" },
      { status: 200 }
    )
  } catch (err) {
    console.error("Reset password error:", err)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}