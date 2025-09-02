import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createServerClient } from "@/lib/supabaseServer"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const supabase = createServerClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, partner_id, partner_email")
    .eq("id", session.user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  if (profile.partner_id) {
    const { data: partner, error: partnerError } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, email")
      .eq("id", profile.partner_id)
      .single()

    if (partnerError) {
      return NextResponse.json({ error: partnerError.message }, { status: 500 })
    }

    return NextResponse.json({ partner })
  }

  if (profile.partner_email) {
    return NextResponse.json({
      partner: null,
      waitingFor: profile.partner_email,
    })
  }

  return NextResponse.json({ partner: null })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await req.json()
  const { partner_email } = body

  if (!partner_email) {
    return NextResponse.json(
      { error: "partner_email is required" },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  // 1️⃣ проверяем, есть ли такой пользователь в profiles
  const { data: partnerProfile, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", partner_email)
    .single()

  if (lookupError && lookupError.code !== "PGRST116") {
    return NextResponse.json({ error: lookupError.message }, { status: 500 })
  }

  if (partnerProfile) {
    // 2️⃣ если уже зарегистрирован → ставим связь сразу у обоих
    await supabase
      .from("profiles")
      .update({ partner_id: partnerProfile.id, partner_email: null })
      .eq("id", session.user.id)

    await supabase
      .from("profiles")
      .update({ partner_id: session.user.id, partner_email: null })
      .eq("id", partnerProfile.id)

    return NextResponse.json({
      success: true,
      message: "Партнёр найден и привязан!",
    })
  } else {
    // 3️⃣ если партнёр ещё не зарегистрировался → просто сохраняем email
    const { error } = await supabase
      .from("profiles")
      .update({ partner_email })
      .eq("id", session.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Email партнёра сохранён. Ждём регистрации партнёра.",
    })
  }
}
