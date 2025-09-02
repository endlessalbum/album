"use client";
import { useEffect, useState } from "react";

type User = { id: string; email?: string; created_at: string };

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/list-users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(userId: string) {
    if (!confirm("Удалить пользователя?")) return;

    const res = await fetch("/api/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    if (data.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert("Пользователь удалён!");
    } else {
      alert("Ошибка: " + data.error);
    }
  }

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Список пользователей</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Дата создания</th>
            <th className="border px-2 py-1">Действие</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.email ?? "—"}</td>
              <td className="border px-2 py-1">
                {new Date(u.created_at).toLocaleString()}
              </td>
              <td className="border px-2 py-1">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(u.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
