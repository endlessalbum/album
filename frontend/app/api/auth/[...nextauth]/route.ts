import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// создаём обработчик NextAuth
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
