"use client"
// AGENDA · arquetipo grilla-semana. COMPONENTE ESTRELLA "La Silla".
// Columnas = barberos/sillas, filas = franjas de 30 min. Cabecera con avatar del
// barbero y contador "silla libre en NN min". Bloques de alto proporcional a la
// duracion, tenidos por servicio. Huecos crema = vendibles. Linea "ahora" de laton.
// Todo el color y los numeros salen de theme.ts via shell/agenda.ts.
import { useEffect, useState } from "react"
import { theme } from "@/shell/theme"
import {
  franjas, franjaPx, rejillaPx, totalFranjas, franjaMin, aperturaMin, cierreMin,
  topDe, altoDe, finDe, hhmmToMin, minToHHMM,
  bloqueDeTinte, chipDeEstado, rotuloDeEstado, precio,
} from "@/shell/agenda"
import { getBarberos, getTurnos, type Barbero, type Turno } from "./api"

export function AgendaPage() {
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [filtro, setFiltro] = useState<string>("todos")
  const [nowMin, setNowMin] = useState<number | null>(null) // se calcula en cliente: evita hydration mismatch
  const [flash, setFlash] = useState<Record<string, boolean>>({})

  useEffect(() => {
    getBarberos().then(setBarberos)
    getTurnos().then(setTurnos)
  }, [])

  // Reloj solo-cliente. Se clampa dentro del horario para que la linea "ahora"
  // y los contadores siempre se vean en la demo, sin distorsionar la logica.
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const real = d.getHours() * 60 + d.getMinutes()
      setNowMin(Math.min(Math.max(real, aperturaMin + 45), cierreMin - 45))
    }
    tick()
    const id = setInterval(tick, 20000)
    return () => clearInterval(id)
  }, [])

  const visibles = filtro === "todos" ? barberos : barberos.filter((b) => b.id === filtro)

  function confirmar(id: string) {
    setTurnos((ts) => ts.map((t) => (t.id === id && t.estado === "pendiente" ? { ...t, estado: "confirmado" } : t)))
    setFlash((f) => ({ ...f, [id]: true }))
    setTimeout(() => setFlash((f) => ({ ...f, [id]: false })), 900)
  }
  // Momento grabable: mover un turno a la siguiente silla (cambia de barbero).
  function moverSilla(id: string) {
    setTurnos((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t
        const i = barberos.findIndex((b) => b.id === t.barberoId)
        const next = barberos[(i + 1) % barberos.length]
        return { ...t, barberoId: next.id }
      })
    )
  }

  // Minutos hasta que se libera la silla de un barbero (0 = libre ahora).
  function libreEn(barberoId: string): number | null {
    if (nowMin === null) return null
    const enCurso = turnos
      .filter((t) => t.barberoId === barberoId && t.estado !== "cancelado" && t.estado !== "no-vino")
      .map((t) => {
        const s = hhmmToMin(t.inicio)
        return { s, e: s + theme.servicios[t.servicio].dur }
      })
      .find((x) => nowMin >= x.s && nowMin < x.e)
    return enCurso ? enCurso.e - nowMin : 0
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <Encabezado
        barberos={barberos}
        filtro={filtro}
        setFiltro={setFiltro}
        totalTurnos={turnos.filter((t) => t.estado === "confirmado" || t.estado === "pendiente").length}
      />

      <div className="mt-5 overflow-auto rounded-xl border border-border" style={{ maxHeight: "calc(100vh - 210px)" }}>
        <div className="flex min-w-max">
          {/* Gutter horario */}
          <div className="sticky left-0 z-20 shrink-0 bg-bg" style={{ width: 66 }}>
            <div className="sticky top-0 z-30 h-[92px] border-b-2 border-laton/60 bg-bg" />
            <div className="relative" style={{ height: rejillaPx }}>
              {franjas.map((f, i) => (
                <div
                  key={f}
                  className="absolute right-2 -translate-y-1/2 font-heading text-sm tracking-wide text-muted"
                  style={{ top: i * franjaPx }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Una columna por barbero/silla */}
          {visibles.map((b) => (
            <Columna
              key={b.id}
              barbero={b}
              turnos={turnos.filter((t) => t.barberoId === b.id)}
              libreEn={libreEn(b.id)}
              nowMin={nowMin}
              flash={flash}
              onConfirmar={confirmar}
              onMover={moverSilla}
            />
          ))}
        </div>
      </div>
      <Leyenda />
    </div>
  )
}

function Encabezado({
  barberos, filtro, setFiltro, totalTurnos,
}: { barberos: Barbero[]; filtro: string; setFiltro: (v: string) => void; totalTurnos: number }) {
  const chips = [{ id: "todos", nombre: "Todos" }, ...barberos]
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-4xl tracking-wide text-fg">AGENDA</h1>
        <p className="mt-1 text-sm text-muted">
          Agenda del dia · {theme.agenda.apertura}&ndash;{theme.agenda.cierre} ·{" "}
          <span className="font-heading text-lg text-accent">{totalTurnos}</span> turnos activos
        </p>
      </div>
      {/* Estructura titulo-con-filtros: chips de barbero reemplazan al buscador. */}
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = filtro === c.id
          return (
            <button
              key={c.id}
              onClick={() => setFiltro(c.id)}
              className={
                "chip cursor-pointer transition-colors " +
                (active ? "bg-accent text-surface" : "bg-surface text-muted border border-border hover:border-laton")
              }
            >
              {c.nombre}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Columna({
  barbero, turnos, libreEn, nowMin, flash, onConfirmar, onMover,
}: {
  barbero: Barbero
  turnos: Turno[]
  libreEn: number | null
  nowMin: number | null
  flash: Record<string, boolean>
  onConfirmar: (id: string) => void
  onMover: (id: string) => void
}) {
  // Franjas ocupadas por algun turno (para saber donde va un hueco LIBRE).
  const ocupadas = new Set<number>()
  for (const t of turnos) {
    const start = Math.round((hhmmToMin(t.inicio) - aperturaMin) / franjaMin)
    const span = Math.max(1, Math.round(theme.servicios[t.servicio].dur / franjaMin))
    for (let k = 0; k < span; k++) ocupadas.add(start + k)
  }

  const ocupada = libreEn !== null && libreEn > 0
  return (
    <div className="shrink-0 border-l border-border" style={{ width: 232 }}>
      {/* Cabecera sticky con avatar del barbero */}
      <div className="sticky top-0 z-10 flex h-[92px] items-center gap-3 border-b-2 border-laton/60 bg-surface px-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-2xl tracking-wide text-surface ring-2 ring-laton ring-offset-2 ring-offset-surface">
          {barbero.inicial}
        </span>
        <div className="min-w-0">
          <div className="truncate font-heading text-xl tracking-wide text-fg">{barbero.nombre}</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className={"h-2 w-2 rounded-full " + (ocupada ? "bg-accent" : "bg-success")} />
            <span className="text-[11px] text-muted">
              {libreEn === null ? "—" : ocupada ? `Silla libre en ${libreEn} min` : "Silla libre ahora"}
            </span>
          </div>
        </div>
      </div>

      {/* Cuerpo: gridlines + huecos + turnos + linea ahora */}
      <div className="relative bg-bg" style={{ height: rejillaPx }}>
        {/* Lineas de franja */}
        {Array.from({ length: totalFranjas }).map((_, i) => (
          <div key={i} className="absolute inset-x-0 border-t border-border/70" style={{ top: i * franjaPx }} />
        ))}

        {/* Huecos vendibles */}
        {franjas.map((f, i) =>
          ocupadas.has(i) ? null : (
            <div
              key={f}
              className="libre absolute inset-x-1.5 flex items-center justify-between rounded px-2"
              style={{ top: i * franjaPx + 3, height: franjaPx - 6 }}
            >
              <span className="font-heading text-sm tracking-widest text-laton">LIBRE</span>
              <span className="text-[10px] text-muted">{f}</span>
            </div>
          )
        )}

        {/* Bloques-turno */}
        {turnos.map((t) => {
          const svc = theme.servicios[t.servicio]
          const muerto = t.estado === "cancelado" || t.estado === "no-vino"
          return (
            <div
              key={t.id}
              className={
                "absolute inset-x-1.5 flex flex-col justify-between overflow-hidden rounded border px-2.5 py-1.5 " +
                bloqueDeTinte[svc.tinte] +
                (flash[t.id] ? " flash-confirmar" : "") +
                (muerto ? " opacity-45" : "")
              }
              style={{ top: topDe(t.inicio) + 2, height: altoDe(svc.dur) - 4 }}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-heading text-sm tracking-wide text-muted">
                  {t.inicio}&ndash;{finDe(t.inicio, svc.dur)}
                </span>
                <span className={"chip " + chipDeEstado[t.estado]}>{rotuloDeEstado[t.estado]}</span>
              </div>
              <div className="min-w-0">
                <div className={"truncate font-heading text-lg leading-tight tracking-wide text-fg " + (muerto ? "line-through" : "")}>
                  {t.cliente}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] uppercase tracking-wide text-muted">{svc.label}</span>
                  <span className="font-heading text-base tracking-wide text-accent">{precio(svc.precio)}</span>
                </div>
              </div>
              {!muerto && (
                <div className="mt-1 flex gap-1.5">
                  {t.estado === "pendiente" && (
                    <button
                      onClick={() => onConfirmar(t.id)}
                      className="chip cursor-pointer border border-success/50 bg-success/10 text-success hover:bg-success/20"
                    >
                      Confirmar
                    </button>
                  )}
                  <button
                    onClick={() => onMover(t.id)}
                    title="Mover a la siguiente silla"
                    className="chip cursor-pointer border border-laton/50 bg-laton/10 text-laton hover:bg-laton/20"
                  >
                    Mover silla ›
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {/* Linea "ahora" de laton, cruza la columna. */}
        {nowMin !== null && nowMin >= aperturaMin && nowMin <= cierreMin && (
          <div
            className="linea-ahora pointer-events-none absolute inset-x-0 z-10 flex items-center"
            style={{ top: ((nowMin - aperturaMin) / franjaMin) * franjaPx }}
          >
            <span className="h-[2px] w-full bg-laton" />
          </div>
        )}
      </div>
    </div>
  )
}

function Leyenda() {
  const items: { label: string; cls: string }[] = [
    { label: "Corte", cls: "bg-info/25 border-info/45" },
    { label: "Barba", cls: "bg-accent/20 border-accent/40" },
    { label: "Combo", cls: "bg-accent/35 border-laton" },
  ]
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
      <span className="font-heading text-sm tracking-widest">SERVICIO</span>
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className={"h-3 w-4 rounded border " + i.cls} />
          {i.label}
        </span>
      ))}
      <span className="ml-2 flex items-center gap-1.5">
        <span className="h-[2px] w-5 bg-laton" /> Ahora
      </span>
    </div>
  )
}
