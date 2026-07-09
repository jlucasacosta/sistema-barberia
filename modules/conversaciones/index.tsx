"use client"
import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { getThreads, getMessages, type Thread, type Message } from "./api"

const iniciales = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")

// Tinte estable por hilo: mismo hilo, mismo color. Todo sale de tokens del theme.
const tints = [
  "bg-primary/15 text-primary",
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-accent/15 text-accent",
  "bg-warning/15 text-warning",
]
const tintOf = (id: string) => tints[Number(id) % tints.length]

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

  const actual = threads.find((t) => t.id === active)

  return (
    <div className="flex h-[calc(100vh-2*var(--pad))] gap-5">
      <div className="w-80 shrink-0 overflow-y-auto rounded-xl bg-surface p-2 shadow-card">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={
              "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors " +
              (active === t.id ? "bg-subtle" : "hover:bg-subtle")
            }
          >
            <span
              className={
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold " + tintOf(t.id)
              }
            >
              {iniciales(t.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{t.name}</p>
              <p className="truncate text-sm text-muted">{t.last}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted">{t.time}</span>
              {t.unread > 0 && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-bg">{t.unread}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-surface shadow-card">
        {actual && (
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <span
              className={
                "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold " + tintOf(actual.id)
              }
            >
              {iniciales(actual.name)}
            </span>
            <div>
              <p className="font-medium">{actual.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                en linea
              </p>
            </div>
          </div>
        )}
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
        <div className="flex items-center gap-2 border-t border-border p-4">
          <input
            placeholder="Escribi un mensaje..."
            className="w-full rounded-lg bg-subtle px-3 py-2 text-sm outline-none transition-shadow focus:shadow-sm"
          />
          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-bg transition-opacity hover:opacity-90">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
