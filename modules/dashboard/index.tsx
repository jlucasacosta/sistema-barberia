"use client"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { getKpis, getSales, getActivity, type Kpi, type SalesPoint, type Activity, type Tone } from "./api"

// Mapas literales: Tailwind necesita ver la clase completa en el fuente.
const dot: Record<Tone, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
}
const rail: Record<Tone, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
}

export function DashboardPage() {
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [sales, setSales] = useState<SalesPoint[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getKpis(), getSales(), getActivity()]).then(([k, s, a]) => {
      setKpis(k)
      setSales(s)
      setActivity(a)
      setLoading(false)
    })
  }, [])

  const max = Math.max(...sales.map((s) => s.value), 1)

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {(loading ? Array(4).fill(null) : kpis).map((k: Kpi | null, i: number) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl bg-surface p-5 shadow-card transition-shadow hover:shadow-pop"
          >
            {k ? (
              <>
                <span className={"absolute inset-y-0 left-0 w-1 " + rail[k.tone]} />
                <p className="text-sm text-muted">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold">{k.value}</p>
                <p
                  className={
                    "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs " +
                    (k.delta >= 0 ? "bg-success/15 text-success" : "bg-danger/15 text-danger")
                  }
                >
                  {k.delta >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {Math.abs(k.delta)}% vs mes anterior
                </p>
              </>
            ) : (
              <div className="h-16 animate-pulse rounded-lg bg-subtle" />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-surface p-6 shadow-card lg:col-span-2">
          <h2 className="mb-6 font-heading text-base font-semibold">Cortes de la semana</h2>
          <div className="flex h-48 gap-3">
            {sales.map((s) => (
              <div key={s.label} className="group flex h-full flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100">
                  {s.value}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={
                      "w-full rounded-lg transition-all " + (s.value === max ? "bg-accent" : "bg-primary/70")
                    }
                    style={{ height: (s.value / max) * 100 + "%" }}
                  />
                </div>
                <span className="text-xs text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-surface p-6 shadow-card">
          <h2 className="mb-6 font-heading text-base font-semibold">Actividad</h2>
          <ul className="max-h-[19rem] space-y-4 overflow-y-auto pr-1">
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + dot[a.tone]} />
                <div className="min-w-0">
                  <p className="text-sm">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
