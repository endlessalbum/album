import { ReactNode, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import Image from "next/image";
import AccountMenu from "./AccountMenu";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AccountLayout({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      const { data: membership } = await supabase
        .from("account_members")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership) setRole(membership.role);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <Image src="/logo.png" alt="Logo" width={80} height={80} className="mb-2" />
        <p className="text-lg font-semibold opacity-80">Endless</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <aside className="w-64 p-6 bg-slate-800/50 backdrop-blur-xl">
        <AccountMenu role={role} />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
