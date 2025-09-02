import { NextResponse } from "next/server"
import { getSupabaseUser } from "@/lib/supabaseAuth"

export async function GET() {
  try {
    const user = await getSupabaseUser()
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // нормализуем поля, чтобы не было undefined
    const safeUser = {
      id: user.id,
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
    }

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (err) {
    console.error("GET /api/me error:", err)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}