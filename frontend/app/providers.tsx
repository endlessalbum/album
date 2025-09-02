// frontend/app/providers.tsx
"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode, createContext, useContext } from "react"
import { useUser } from "@/hooks/useUser"

interface UserContextValue {
  user: any
  loading: boolean
}

const UserContext = createContext<UserContextValue | null>(null)

export function useUserContext() {
  return useContext(UserContext)
}

export default function Providers({ children }: { children: ReactNode }) {
  const { user, loading } = useUser()

  return (
    <SessionProvider>
      <UserContext.Provider value={{ user, loading }}>
        {children}
      </UserContext.Provider>
    </SessionProvider>
  )
}