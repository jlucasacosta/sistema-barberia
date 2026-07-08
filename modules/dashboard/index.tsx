"use client"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { getKpis, getSales, getActivity, type Kpi, type SalesPoint, type Activity } from "./api"

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
          <div key={i} className="rounded-xl bg-surface p-5 shadow-card transition-shadow hover:shadow-pop">
            {k ? (
              <>
                <p className="text-sm text-muted">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold">{k.value}</p>
                <p className={"mt-2 flex items-center gap-1 text-xs " + (k.delta >= 0 ? "text-accent" : "text-muted")}>
                  {k.delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
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
              <div key={s.label} className="flex h-full flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-lg bg-primary transition-all"
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
          <ul className="space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm">{a.text}</p>
                <p className="mt-0.5 text-xs text-muted">{a.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
