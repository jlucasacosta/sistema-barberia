"use client"
// DASHBOARD · arquetipo board. KPI = ANILLOS de ocupacion por barbero (SVG
// stroke-dasharray, estaticos). Grafico = BARRAS-RANKING de servicios. Incluye una version
// reducida de "La Silla". Color y tinte salen de tokens/theme. Sin buscador, sin iconos.
import { useState } from "react"
import Link from "next/link"
import { theme } from "@/shell/theme"
import { bloqueDeTinte, precio } from "@/shell/agenda"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { getOcupacion, getRankingServicios, getActividad, type Ocupacion, type Actividad } from "./api"
import { getBarberos, getTurnos } from "@/modules/agenda/api"

const puntoActividad: Record<Actividad["tipo"], string> = {
  cobro: "bg-success",
  turno: "bg-info",
  rechazo: "bg-danger",
  mensaje: "bg-laton",
}
const cargarDashboard = () =>
  Promise.all([getOcupacion(), getRankingServicios(), getActividad(), getBarberos(), getTurnos()])
const VISIBLES = 6

export function DashboardPage() {
  const { data, error, cargando, reintentar } = useCarga(cargarDashboard)
  const [verTodo, setVerTodo] = useState(false)

  const ocup = data?.[0] ?? []
  const ranking = data?.[1] ?? []
  const act = data?.[2] ?? []
  const barberos = data?.[3] ?? []
  const turnos = data?.[4] ?? []
  const maxRank = Math.max(1, ...ranking.map((r) => r.valor))
  const actVisible = verTodo ? act : act.slice(0, VISIBLES)

  return (
    <div className="mx-auto max-w-[1400px]">
      <h1 className="font-heading text-4xl tracking-wide text-fg">DASHBOARD</h1>
      <p className="mt-1 text-sm text-muted">{theme.brand.name} · resumen del día · cierre de caja</p>

      {error ? (
        <div className="mt-5">
          <ErrorCarga mensaje="No pudimos cargar el resumen del día." onReintentar={reintentar} />
        </div>
      ) : (
        <>
          {/* Anillos de ocupacion */}
          <section aria-busy={cargando} className="mt-5">
            <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">OCUPACIÓN POR SILLA</h2>
            <p className="mt-2 text-xs text-muted">
              Cada anillo es el porcentaje de la jornada ({theme.agenda.apertura}&ndash;{theme.agenda.cierre}) con turnos
              pendientes o confirmados; el anillo completo es el 100%.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
              {cargando
                ? Array.from({ length: 4 }).map((_, i) => <Esqueleto key={i} className="h-24 lg:h-32" />)
                : ocup.map((o) => <Anillo key={o.barberoId} o={o} />)}
            </div>
          </section>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
            {/* Barras-ranking */}
            <section aria-busy={cargando} className="surface-card border border-border p-4">
              <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">SERVICIOS DEL DÍA</h2>
              <p className="mt-2 text-xs text-muted">
                Turnos pendientes o confirmados por servicio. La barra más larga es el máximo ({cargando ? "—" : maxRank}); 0 = ningún turno.
              </p>
              <div className="mt-4 space-y-2.5">
                {cargando
                  ? Array.from({ length: 6 }).map((_, i) => <Esqueleto key={i} className="h-5" />)
                  : ranking.map((r) => (
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

            {/* Feed de actividad: los primeros 6; "Ver todo" expande en la misma pagina. */}
            <section aria-busy={cargando} className="surface-card border border-border p-4">
              <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">ACTIVIDAD</h2>
              {cargando ? (
                <div className="mt-3 space-y-2.5">
                  {Array.from({ length: VISIBLES }).map((_, i) => (
                    <Esqueleto key={i} className="h-10" />
                  ))}
                </div>
              ) : (
                <>
                  <ul className="mt-3 space-y-2.5">
                    {actVisible.map((a, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span aria-hidden="true" className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + puntoActividad[a.tipo]} />
                        <div>
                          <span className="font-heading text-sm tracking-wide text-muted">{a.hora}</span>
                          <p className="text-sm leading-tight text-fg">{a.texto}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {act.length > VISIBLES && (
                    <button
                      type="button"
                      onClick={() => setVerTodo((v) => !v)}
                      aria-expanded={verTodo}
                      className="chip chip-btn mt-3 border border-border bg-surface text-fg hover:border-laton"
                    >
                      {verTodo ? "Ver menos" : `Ver todo (${act.length})`}
                    </button>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Mini "La Silla" */}
          <section aria-busy={cargando} className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="filete inline-block font-heading text-2xl tracking-wide text-fg">AGENDA · HOY</h2>
              <Link href="/agenda" className="tap flex items-center text-sm text-accent hover:underline">
                Ver agenda completa ›
              </Link>
            </div>
            <div
              role="region"
              aria-label="Agenda de hoy por barbero (desplazable)"
              tabIndex={0}
              className="mt-3 flex gap-3 overflow-x-auto pb-2"
            >
              {cargando && Array.from({ length: 4 }).map((_, i) => <Esqueleto key={i} className="h-56 w-48 shrink-0" />)}
              {barberos.map((b) => {
                const suyos = turnos
                  .filter((t) => t.barberoId === b.id && t.estado !== "cancelado" && t.estado !== "no-vino")
                  .sort((x, y) => x.inicio.localeCompare(y.inicio))
                return (
                  <div key={b.id} className="w-48 shrink-0 rounded-xl border border-border bg-surface p-2">
                    <div className="mb-2 flex items-center gap-2">
                      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm tracking-wide text-surface ring-1 ring-laton">
                        {b.inicial}
                      </span>
                      <h3 className="font-heading text-lg tracking-wide text-fg">{b.nombre.split(" ")[0]}</h3>
                    </div>
                    <div className="space-y-1.5">
                      {suyos.map((t) => {
                        const svc = theme.servicios[t.servicio]
                        return (
                          <div key={t.id} className={"rounded border px-2 py-1 " + bloqueDeTinte[svc.tinte]}>
                            <div className="flex items-center justify-between">
                              <span className="font-heading text-sm tracking-wide text-fg/70">{t.inicio}</span>
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
        </>
      )}
    </div>
  )
}

// Anillo SVG: progreso contra 100% via stroke-dasharray. Color = accent (token). Estatico.
function Anillo({ o }: { o: Ocupacion }) {
  const r = 34
  const c = 2 * Math.PI * r
  const filled = o.pct * c
  return (
    <div className="surface-card flex items-center gap-3 border border-border p-3 lg:gap-4 lg:p-4">
      <div className="relative h-16 w-16 shrink-0 lg:h-24 lg:w-24">
        <svg viewBox="0 0 80 80" aria-hidden="true" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(var(--subtle))" strokeWidth="7" />
          <circle
            cx="40" cy="40" r={r} fill="none"
            stroke="rgb(var(--accent))" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${filled} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-lg tracking-wide text-fg lg:text-2xl">{Math.round(o.pct * 100)}%</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm tracking-wide text-surface ring-1 ring-laton lg:flex">
            {o.inicial}
          </span>
          <h3 className="truncate font-heading text-lg tracking-wide text-fg lg:text-xl">{o.nombre}</h3>
        </div>
        <p className="mt-1 text-xs text-muted">
          {o.turnos} turnos<span className="sr-only"> · ocupación {Math.round(o.pct * 100)}%</span>
        </p>
      </div>
    </div>
  )
}
