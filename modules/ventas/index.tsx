"use client"
// VENTAS · arquetipo kanban. Columnas = estado del cobro (pendiente / cobrado /
// rechazado). Las tarjetas avanzan por boton. Muestra el flujo del dia, no una lista
// muerta. Filtro por chips de barbero (reemplaza al buscador). Todo color de tokens.
import { useEffect, useMemo, useState } from "react"
import { theme } from "@/shell/theme"
import { precio } from "@/shell/agenda"
import { getTickets, type Ticket, type EstadoCobro } from "./api"

const COLUMNAS: { estado: EstadoCobro; titulo: string; acento: string }[] = [
  { estado: "pendiente", titulo: "Por cobrar", acento: "border-warning" },
  { estado: "cobrado", titulo: "Cobrado", acento: "border-success" },
  { estado: "rechazado", titulo: "Rechazado", acento: "border-danger" },
]

const chipMetodo = "chip border border-border bg-subtle/60 text-muted"

export function VentasPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filtro, setFiltro] = useState<string>("todos")

  useEffect(() => {
    getTickets().then(setTickets)
  }, [])

  const barberos = useMemo(() => Array.from(new Set(tickets.map((t) => t.barbero))), [tickets])
  const filtrados = filtro === "todos" ? tickets : tickets.filter((t) => t.barbero === filtro)

  function mover(id: string, estado: EstadoCobro) {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, estado } : t)))
  }

  const totalDia = filtrados.filter((t) => t.estado === "cobrado").reduce((a, t) => a + t.total, 0)

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl tracking-wide text-fg">CAJA DEL DIA</h1>
          <p className="mt-1 text-sm text-muted">
            Cobrado hoy: <span className="font-heading text-lg text-accent">{precio(totalDia)}</span> ·{" "}
            {filtrados.filter((t) => t.estado === "rechazado").length} rechazos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["todos", ...barberos].map((b) => {
            const active = filtro === b
            return (
              <button
                key={b}
                onClick={() => setFiltro(b)}
                className={
                  "chip cursor-pointer transition-colors " +
                  (active ? "bg-accent text-surface" : "border border-border bg-surface text-muted hover:border-laton")
                }
              >
                {b === "todos" ? "Todos" : b}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {COLUMNAS.map((col) => {
          const items = filtrados.filter((t) => t.estado === col.estado)
          const suma = items.reduce((a, t) => a + t.total, 0)
          return (
            <div key={col.estado} className={"rounded-xl border-t-4 bg-bg " + col.acento}>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="font-heading text-xl tracking-wide text-fg">{col.titulo}</span>
                <span className="chip border border-border bg-surface text-muted">
                  {items.length} · {precio(suma)}
                </span>
              </div>
              <div className="space-y-2.5 px-2.5 pb-3">
                {items.map((t) => (
                  <TarjetaCobro key={t.id} t={t} onMover={mover} />
                ))}
                {items.length === 0 && (
                  <div className="libre rounded px-3 py-6 text-center font-heading tracking-widest text-laton">VACIO</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TarjetaCobro({ t, onMover }: { t: Ticket; onMover: (id: string, e: EstadoCobro) => void }) {
  return (
    <article className="surface-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-heading text-lg leading-tight tracking-wide text-fg">{t.cliente}</div>
          <div className="text-[11px] uppercase tracking-wide text-muted">
            {t.barbero} · {t.hora}
          </div>
        </div>
        <span className="font-heading text-2xl leading-none tracking-wide text-accent">{precio(t.total)}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {t.items.map((it) => (
          <span key={it} className="chip border border-border bg-subtle/50 text-fg/80">{it}</span>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className={chipMetodo}>{t.metodo}</span>
        <div className="flex gap-1.5">
          {t.estado === "pendiente" && (
            <>
              <button
                onClick={() => onMover(t.id, "cobrado")}
                className="chip cursor-pointer border border-success/50 bg-success/10 text-success hover:bg-success/20"
              >
                Cobrar ›
              </button>
              <button
                onClick={() => onMover(t.id, "rechazado")}
                className="chip cursor-pointer border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20"
              >
                Rechazar
              </button>
            </>
          )}
          {t.estado === "rechazado" && (
            <button
              onClick={() => onMover(t.id, "pendiente")}
              className="chip cursor-pointer border border-warning/50 bg-warning/10 text-warning hover:bg-warning/20"
            >
              Reintentar ‹
            </button>
          )}
          {t.estado === "cobrado" && <span className="chip border border-success/40 bg-success/10 text-success">OK</span>}
        </div>
      </div>
    </article>
  )
}
