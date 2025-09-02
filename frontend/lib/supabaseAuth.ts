// frontend/lib/supabaseAuth.ts
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getSupabaseUser() {
  const cookieStore = cookies()
  const access_token = cookieStore.get("sb-access-token")?.value

  if (!access_token) return null

  const { data, error } = await supabase.auth.getUser(access_token)

  if (error || !data.user) return null

  return data.user
}