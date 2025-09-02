import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { NextResponse } from "next/server"

// Функция для обработки ошибок Prisma
export function handlePrismaError(err: unknown) {
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Запись с таким уникальным значением уже существует" },
          { status: 400 }
        )
      case "P2003":
        return NextResponse.json(
          { error: "Ошибка внешнего ключа (связанные данные отсутствуют)" },
          { status: 400 }
        )
      default:
        return NextResponse.json(
          { error: `Ошибка базы данных: ${err.code}` },
          { status: 500 }
        )
    }
  }

  // Если ошибка не от Prisma → возвращаем generic
  return NextResponse.json(
    { error: "Внутренняя ошибка сервера" },
    { status: 500 }
  )
}