"use client"
// DASHBOARD · arquetipo board. KPI = ANILLOS de ocupacion por barbero (SVG
// stroke-dasharray). Grafico = BARRAS-RANKING de servicios. Incluye una version
// reducida de "La Silla". Color y tinte salen de tokens/theme. Sin buscador, sin iconos.
import { useEffect, useState } from "react"
import { theme } from "@/shell/theme"
import { bloqueDeTinte, precio } from "@/shell/agenda"
import { getOcupacion, getRankingServicios, getActividad, type Ocupacion, type RankItem, type Actividad } from "./api"
import { getBarberos, getTurnos, type Barbero, type Turno } from "@/modules/agenda/api"

const puntoActividad: Record<Actividad["tipo"], string> = {
  cobro: "bg-success",
  turno: "bg-info",
  rechazo: "bg-danger",
  mensaje: "bg-laton",
}

export function DashboardPage() {
  const [ocup, setOcup] = useState<Ocupacion[]>([])
  const [ranking, setRanking] = useState<RankItem[]>([])
  const [act, setAct] = useState<Actividad[]>([])
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])

  useEffect(() => {
    getOcupacion().then(setOcup)
    getRankingServicios().then(setRanking)
    getActividad().then(setAct)
    getBarberos().then(setBarberos)
    getTurnos().then(setTurnos)
  }, [])

  const maxRank = Math.max(1, ...ranking.map((r) => r.valor))

  return (
    <div className="mx-auto max-w-[1400px]">
      <h1 className="font-heading text-4xl tracking-wide text-fg">{theme.brand.name.toUpperCase()}</h1>
      <p className="mt-1 text-sm text-muted">Resumen del dia · cierre de caja</p>

      {/* Anillos de ocupacion */}
      <section className="mt-5">
        <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">OCUPACION POR SILLA</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ocup.map((o) => (
            <Anillo key={o.barberoId} o={o} />
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Barras-ranking */}
        <section className="surface-card border border-border p-4">
          <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">SERVICIOS DEL DIA</h2>
          <div className="mt-4 space-y-2.5">
            {ranking.map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm text-muted">{r.label}</span>
                <div className="h-5 flex-1 overflow-hidden rounded bg-subtle/60">
                  <div className="h-full rounded bg-accent" style={{ width: `${(r.valor / maxRank) * 100}%` }} />
                </div>
                <span className="w-6 text-right font-heading text-lg tracking-wide text-fg">{r.valor}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feed de actividad */}
        <section className="surface-card border border-border p-4">
          <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">ACTIVIDAD</h2>
          <ul className="mt-3 space-y-2.5">
            {act.map((a, i) => (
              <li key={i} className="flex gap-2.5">
                <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + puntoActividad[a.tipo]} />
                <div>
                  <span className="font-heading text-sm tracking-wide text-muted">{a.hora}</span>
                  <p className="text-sm leading-tight text-fg">{a.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Mini "La Silla" */}
      <section className="mt-6">
        <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">LA SILLA · HOY</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {barberos.map((b) => {
            const suyos = turnos
              .filter((t) => t.barberoId === b.id && t.estado !== "cancelado" && t.estado !== "no-vino")
              .sort((x, y) => x.inicio.localeCompare(y.inicio))
            return (
              <div key={b.id} className="w-48 shrink-0 rounded-xl border border-border bg-surface p-2">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm tracking-wide text-surface ring-1 ring-laton">
                    {b.inicial}
                  </span>
                  <span className="font-heading text-lg tracking-wide text-fg">{b.nombre.split(" ")[0]}</span>
                </div>
                <div className="space-y-1.5">
                  {suyos.map((t) => {
                    const svc = theme.servicios[t.servicio]
                    return (
                      <div key={t.id} className={"rounded border px-2 py-1 " + bloqueDeTinte[svc.tinte]}>
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-sm tracking-wide text-muted">{t.inicio}</span>
                          <span className="font-heading text-sm tracking-wide text-accent">{precio(svc.precio)}</span>
                        </div>
                        <div className="truncate text-xs text-fg">{t.cliente}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

// Anillo SVG: progreso contra 100% via stroke-dasharray. Color = accent (token).
function Anillo({ o }: { o: Ocupacion }) {
  const r = 34
  const c = 2 * Math.PI * r
  const filled = o.pct * c
  return (
    <div className="surface-card flex items-center gap-4 border border-border p-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(var(--subtle))" strokeWidth="7" />
          <circle
            cx="40" cy="40" r={r} fill="none"
            stroke="rgb(var(--accent))" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${filled} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-2xl tracking-wide text-fg">{Math.round(o.pct * 100)}%</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm tracking-wide text-surface ring-1 ring-laton">
            {o.inicial}
          </span>
          <span className="font-heading text-xl tracking-wide text-fg">{o.nombre}</span>
        </div>
        <p className="mt-1 text-xs text-muted">{o.turnos} turnos hoy</p>
      </div>
    </div>
  )
}
