"use client"

export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-transparent backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}
