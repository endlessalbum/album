// frontend/app/api/me/route.ts
import { NextResponse } from "next/server"
import { getSupabaseUser } from "@/lib/supabaseAuth"

export async function GET() {
  try {
    const user = await getSupabaseUser()
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }
    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error("GET /api/me error:", err)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}