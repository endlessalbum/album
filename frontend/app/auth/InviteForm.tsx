"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "p-3 rounded-xl bg-white/20 text-white placeholder-white/60 transition";
const buttonClass =
  "rounded-xl bg-blue-500 text-white py-3 hover:bg-blue-600 transition";

export default function InviteForm() {
  const [mode, setMode] = useState<"has" | "new" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [invite, setInvite] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("text-white");

  const router = useRouter();

  useEffect(() => {
    if (confirm && password === confirm) {
      setStatus("");
    }
  }, [password, confirm]);

  // Проверка формата email
  function isValidEmail(mail: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
  }

  // Проверка сложности пароля
  function isPasswordStrong(pw: string) {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(pw);
  }

  // единая функция обработки ошибок
  function handleError(error: string) {
    let msg = "Ошибка";
    switch (error) {
      case "user_not_found":
        msg = "Пользователь не найден";
        break;
      case "invalid_password":
        msg = "Пароль неверный";
        break;
      case "invalid_invite":
        msg = "Инвайт недействителен";
        break;
      case "invite_expired":
        msg = "Инвайт просрочен";
        break;
      case "email_already_registered":
        msg = "Почта уже зарегистрирована";
        break;
      default:
        msg = error || "Не удалось выполнить действие";
    }
    setStatus(msg);
    setStatusColor("text-red-400");
  }

  // вход с аккаунтом
  const handleJoinWithAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (!isValidEmail(email)) {
      handleError("Введите корректный email");
      setLoading(false);
      return;
    }

    if (!invite || invite.length < 6) {
      handleError("invalid_invite");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/invite-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, invite }),
    });

    const data = await res.json();
    if (!res.ok) {
      handleError(data.error);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  // регистрация с инвайтом
  const handleJoinWithoutAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    if (!isValidEmail(email)) {
      handleError("Введите корректный email");
      return;
    }

    if (!isPasswordStrong(password)) {
      handleError("Пароль должен быть минимум 8 символов, с цифрой и заглавной буквой");
      return;
    }

    if (password !== confirm) {
      handleError("Пароли не совпадают");
      return;
    }

    if (!invite || invite.length < 6) {
      handleError("invalid_invite");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, invite }),
    });

    const data = await res.json();
    if (!res.ok) {
      handleError(data.error);
      setLoading(false);
      return;
    }

    setStatus("Регистрация успешна, теперь войдите");
    setStatusColor("text-green-400");
    setLoading(false);
    router.push("/auth");
  };

  // начальный экран
  if (!mode) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => setMode("has")} className={buttonClass}>
          У меня есть аккаунт
        </button>
        <button onClick={() => setMode("new")} className={buttonClass}>
          У меня нет аккаунта
        </button>
      </div>
    );
  }

  // режим входа
  if (mode === "has") {
    return (
      <form onSubmit={handleJoinWithAccount} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="text"
          placeholder="Инвайт-код"
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
          className={inputClass}
          required
        />
        {status && <p className={`${statusColor} text-base`}>{status}</p>}
        <div className="flex gap-2">
          <button disabled={loading} type="submit" className={buttonClass + " flex-1"}>
            Войти
          </button>
          <button
            type="button"
            onClick={() => setMode(null)}
            className="flex-1 rounded-xl bg-gray-600 text-white py-3 hover:bg-gray-700 transition"
          >
            Назад
          </button>
        </div>
      </form>
    );
  }

  // режим регистрации
  if (mode === "new") {
    return (
      <form onSubmit={handleJoinWithoutAccount} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="password"
          placeholder="Подтверждение пароля"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="text"
          placeholder="Инвайт-код"
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
          className={inputClass}
          required
        />
        {status && <p className={`${statusColor} text-base`}>{status}</p>}
        <div className="flex gap-2">
          <button disabled={loading} type="submit" className={buttonClass + " flex-1"}>
            Зарегистрироваться
          </button>
          <button
            type="button"
            onClick={() => setMode(null)}
            className="flex-1 rounded-xl bg-gray-600 text-white py-3 hover:bg-gray-700 transition"
          >
            Назад
          </button>
        </div>
      </form>
    );
  }
}