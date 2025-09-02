import { NextResponse } from "next/server"
import { getSupabaseUser } from "@/lib/supabaseAuth"

export async function GET() {
  try {
    const user = await getSupabaseUser()
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // нормализуем supabase user → наш формат User
    const safeUser = {
      id: user.id,
      name: user.user_metadata?.name ?? null,
      email: user.email ?? null,
      image: user.user_metadata?.avatar_url ?? null,
    }

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (err) {
    console.error("GET /api/me error:", err)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}