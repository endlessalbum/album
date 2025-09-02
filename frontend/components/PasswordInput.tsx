import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const inputClass =
  "p-3 rounded-xl bg-white/20 text-white placeholder-white/60 w-full"

export default function PasswordInput({ value, onChange, placeholder }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative w-full">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
}
