import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Copy } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function InvitesPage() {
  const [accountCode, setAccountCode] = useState<string | null>(null)
  const [invites, setInvites] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data: accounts } = await supabase
        .from("accounts")
        .select("invite_code")
        .eq("owner_id", user.id)
        .maybeSingle()

      if (accounts) setAccountCode(accounts.invite_code)
      fetchInvites(user.id)
    })()
  }, [])

  async function fetchInvites(ownerId: string) {
    const { data } = await supabase
      .from("invites")
      .select("*")
      .eq("owner", ownerId)
      .order("created_at", { ascending: false })
    if (data) setInvites(data)
  }

  async function generateInvite() {
    if (!user) return
    setLoading(true)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    await supabase.from("invites").insert({ code, owner: user.id })
    setLoading(false)
    fetchInvites(user.id)
  }

  function copyToClipboard(code: string) {
    navigator.clipboard.writeText(code)
    alert("Инвайт скопирован: " + code)
  }

  return (
    <div className="p-6">
      <h1 className="text-base font-bold mb-6">Мои инвайты</h1>

      {accountCode && (
        <div className="mb-6 p-4 bg-white/10 rounded-xl flex justify-between items-center">
          <div>
            <p className="opacity-70">Основной код аккаунта:</p>
            <p className="font-mono text-base">{accountCode}</p>
          </div>
          <button onClick={() => copyToClipboard(accountCode)} className="btn">
            Копировать
          </button>
        </div>
      )}

      <button onClick={generateInvite} disabled={loading} className="btn mb-6">
        {loading ? "Создание..." : "Создать новый инвайт"}
      </button>

      <div className="space-y-4">
        {invites.map((inv) => (
          <div
            key={inv.id}
            className="p-4 bg-white/5 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-mono text-base">{inv.code}</p>
              {inv.used_by ? (
                <p className="text-green-400 text-base">
                  Использован (пользователь {inv.used_by})
                </p>
              ) : (
                <p className="text-yellow-400 text-base">Не использован</p>
              )}
            </div>
            {!inv.used_by && (
              <button
                onClick={() => copyToClipboard(inv.code)}
                className="btn"
              >
                Копировать
              </button>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .btn {
          @apply px-4 py-2 rounded-xl bg-cyan-500/80 hover:bg-cyan-500 transition text-white font-semibold;
        }
      `}</style>
    </div>
  )
}