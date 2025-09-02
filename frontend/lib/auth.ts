// frontend/lib/auth.ts
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { type NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

// Supabase остаётся для работы с файлами / realtime
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getUser() {
  const cookieStore = cookies()
  const access_token = cookieStore.get("sb-access-token")?.value

  if (!access_token) return null

  const { data, error } = await supabase.auth.getUser(access_token)
  if (error || !data.user) return null

  return data.user
}

// Конфигурация NextAuth
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
}