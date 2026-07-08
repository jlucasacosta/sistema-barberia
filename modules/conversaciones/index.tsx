"use client"
import { useEffect, useState } from "react"
import { getThreads, getMessages, type Thread, type Message } from "./api"

export function ConversacionesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Message[]>([])

  useEffect(() => {
    getThreads().then((t) => {
      setThreads(t)
      setActive(t[0]?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (active) getMessages(active).then(setMsgs)
  }, [active])

  return (
    <div className="flex h-[calc(100vh-2*var(--pad))] gap-5">
      <div className="w-72 shrink-0 overflow-y-auto rounded-xl bg-surface p-2 shadow-card">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={
              "flex w-full items-start justify-between gap-2 rounded-lg p-3 text-left transition-colors " +
              (active === t.id ? "bg-subtle" : "hover:bg-subtle")
            }
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{t.name}</p>
              <p className="truncate text-sm text-muted">{t.last}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted">{t.time}</span>
              {t.unread > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-bg">{t.unread}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-surface shadow-card">
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={
                "max-w-[70%] rounded-xl px-3 py-2 text-sm " +
                (m.from === "vos" ? "ml-auto bg-primary text-bg" : "bg-subtle")
              }
            >
              {m.text}
              <span className="mt-1 block text-xs opacity-60">{m.time}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4">
          <input
            placeholder="Escribi un mensaje..."
            className="w-full rounded-lg bg-subtle px-3 py-2 text-sm outline-none transition-shadow focus:shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}
