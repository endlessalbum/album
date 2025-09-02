"use client"

import React from "react"
import { tabs, Tab } from "@/types/tabs"

interface TabSwitcherProps {
  active: Tab
  setActive: (tab: Tab) => void
}

export default function TabSwitcher({ active, setActive }: TabSwitcherProps) {
  return (
    <div className="flex w-full bg-white/10 backdrop-blur-xl rounded-full p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`flex-1 px-4 py-2 rounded-full transition font-medium text-base ${
            active === tab
              ? "bg-white text-black shadow"
              : "text-white hover:bg-white/20"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}