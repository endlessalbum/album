"use client"

import { useSearchParams } from "next/navigation"

export default function ResetConfirmClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  return (
    <div>
      {token ? (
        <p>Токен для сброса пароля: {token}</p>
      ) : (
        <p>Токен отсутствует в URL</p>
      )}
    </div>
  )
}