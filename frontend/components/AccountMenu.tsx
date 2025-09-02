import Link from "next/link";

export default function AccountMenu({ role }: { role: string | null }) {
  const menuItems = [
    { name: "Профиль", href: "/account/profile" },
    { name: "Сообщения", href: "/account/messages" },
    { name: "Инвайты", href: "/account/invites", role: "owner" },
    { name: "Настройки", href: "/account/settings" },
  ];

  const filtered = menuItems.filter((item) => !item.role || item.role === role);

  return (
    <nav className="flex flex-col gap-2">
      {filtered.map((item) => (
        <Link key={item.href} href={item.href} className="px-4 py-2 rounded-lg hover:bg-white/10">
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
