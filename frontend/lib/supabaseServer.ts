import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// ✅ функция для получения серверного клиента
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
