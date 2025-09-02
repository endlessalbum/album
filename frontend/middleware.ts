// frontend/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function middleware(req: NextRequest) {
  const access_token = req.cookies.get("sb-access-token")?.value
  const refresh_token = req.cookies.get("sb-refresh-token")?.value

  if (!access_token) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  const { data, error } = await supabase.auth.getUser(access_token)

  if (error || !data.user) {
    // пробуем обновить с refresh_token
    if (refresh_token) {
      const { data: refreshed, error: refreshError } =
        await supabase.auth.refreshSession({ refresh_token })

      if (!refreshError && refreshed.session) {
        const res = NextResponse.next()
        res.cookies.set("sb-access-token", refreshed.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: refreshed.session.expires_in,
        })
        res.cookies.set("sb-refresh-token", refreshed.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        })
        return res
      }
    }

    return NextResponse.redirect(new URL("/auth", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/album/:path*",
    "/memories/:path*",
    "/settings/:path*",
    "/about/:path*",
  ],
}