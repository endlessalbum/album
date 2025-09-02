"use client"

import { useSearchParams } from "next/navigation"

export default function ConfirmClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  return (
    <div>
      {token ? (
        <p>Ваш токен: {token}</p>
      ) : (
        <p>Токен отсутствует в URL</p>
      )}
    </div>
  )
}