"use client"
// AGENDA · arquetipo grilla-semana. COMPONENTE ESTRELLA "La Silla".
// Columnas = barberos/sillas, filas = franjas de 30 min. Cabecera con avatar del
// barbero y contador "silla libre en NN min". Bloques de alto proporcional a la
// duracion, tenidos por servicio. Huecos crema = vendibles. Linea "ahora" de laton.
// Todo el color y los numeros salen de theme.ts via shell/agenda.ts.
// Cada bloque-turno es un boton que abre la ficha del turno (FichaLateral): el bloque
// chico muestra solo hora + estado + cliente y el detalle y las acciones viven en la ficha.
import { useEffect, useState } from "react"
import { theme } from "@/shell/theme"
import {
  franjas, franjaPx, rejillaPx, totalFranjas, franjaMin, aperturaMin, cierreMin,
  topDe, altoDe, finDe, hhmmToMin,
  bloqueDeTinte, chipDeEstado, rotuloDeEstado, precio,
} from "@/shell/agenda"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"
import { getClientes } from "@/modules/contactos/api"
import { getBarberos, getTurnos, type Barbero, type Turno } from "./api"

const cargarAgenda = () => Promise.all([getBarberos(), getTurnos(), getClientes()])
const codigo = (id: string) => `T-${id.slice(1)}`

export function AgendaPage() {
  const { data, error, cargando, reintentar } = useCarga(cargarAgenda)
  const barberos = data?.[0] ?? []
  const clientes = data?.[2] ?? []
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [filtro, setFiltro] = useState<string>("todos")
  const [nowMin, setNowMin] = useState<number | null>(null) // se calcula en cliente: evita hydration mismatch
  const [sel, setSel] = useState<string | null>(null) // id del turno abierto en la ficha
  const [aviso, setAviso] = useState<string | null>(null) // texto de AvisoDemo dentro de la ficha

  // Copia local de los turnos: confirmar y mover silla viven en estado de React (F5 los restaura).
  useEffect(() => {
    if (data) setTurnos(data[1])
  }, [data])

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
  const turno = turnos.find((t) => t.id === sel) ?? null

  function abrir(id: string) {
    setAviso(null)
    setSel(id)
  }

  function ocupado(barberoId: string, t: Turno): boolean {
    const s = hhmmToMin(t.inicio)
    const e = s + theme.servicios[t.servicio].dur
    return turnos.some((o) => {
      if (o.id === t.id || o.barberoId !== barberoId || o.estado === "cancelado" || o.estado === "no-vino") return false
      const os = hhmmToMin(o.inicio)
      return s < os + theme.servicios[o.servicio].dur && os < e
    })
  }
  // Primera silla, a partir de la siguiente, que esta libre en el horario del turno.
  function sillaLibre(t: Turno): Barbero | null {
    const i = barberos.findIndex((b) => b.id === t.barberoId)
    for (let k = 1; k < barberos.length; k++) {
      const b = barberos[(i + k) % barberos.length]
      if (!ocupado(b.id, t)) return b
    }
    return null
  }

  function confirmar(id: string) {
    setTurnos((ts) => ts.map((t) => (t.id === id && t.estado === "pendiente" ? { ...t, estado: "confirmado" } : t)))
    setAviso("Turno confirmado. Demo: no se guardó nada.")
  }
  // Momento grabable: mover un turno a otra silla (cambia de barbero) sin pisar a nadie.
  function moverSilla(id: string) {
    const t = turnos.find((x) => x.id === id)
    if (!t) return
    const destino = sillaLibre(t)
    if (!destino) {
      setAviso("No hay otra silla libre a esa hora. Demo: no se guardó nada.")
      return
    }
    setTurnos((ts) => ts.map((x) => (x.id === id ? { ...x, barberoId: destino.id } : x)))
    setAviso(`Turno movido a la silla de ${destino.nombre}. Demo: no se guardó nada.`)
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

  const activos = turnos.filter((t) => t.estado === "confirmado" || t.estado === "pendiente").length

  return (
    <div className="mx-auto max-w-[1500px]">
      <Encabezado
        barberos={barberos}
        filtro={filtro}
        setFiltro={setFiltro}
        totalTurnos={cargando || error ? null : activos}
      />

      {error ? (
        <div className="mt-5">
          <ErrorCarga mensaje="No pudimos cargar la agenda." onReintentar={reintentar} />
        </div>
      ) : (
        <>
          <div
            role="region"
            aria-label="Grilla de turnos del día, una columna por barbero"
            aria-busy={cargando}
            tabIndex={0}
            className="mt-5 max-h-[calc(100dvh-210px)] overflow-auto rounded-xl border border-border"
          >
            {cargando ? (
              <Esqueleto className="h-[460px] w-full min-w-[300px]" />
            ) : (
              <div className="flex min-w-max">
                {/* Gutter horario */}
                <div aria-hidden="true" className="sticky left-0 z-20 shrink-0 bg-bg" style={{ width: 66 }}>
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
                    onAbrir={abrir}
                  />
                ))}
              </div>
            )}
          </div>
          <Leyenda />
        </>
      )}

      <FichaLateral
        abierta={!!turno}
        titulo={turno ? turno.cliente : ""}
        subtitulo={turno ? `Turno ${codigo(turno.id)}` : undefined}
        onCerrar={() => setSel(null)}
        acciones={turno && <AccionesFicha turno={turno} sillaLibre={sillaLibre(turno)} onConfirmar={confirmar} onMover={moverSilla} onDemo={setAviso} />}
      >
        {turno && <FichaTurno turno={turno} barberos={barberos} clientes={clientes} aviso={aviso} />}
      </FichaLateral>
    </div>
  )
}

function FichaTurno({
  turno, barberos, clientes, aviso,
}: { turno: Turno; barberos: Barbero[]; clientes: Awaited<ReturnType<typeof getClientes>>; aviso: string | null }) {
  const svc = theme.servicios[turno.servicio]
  const barbero = barberos.find((b) => b.id === turno.barberoId)
  const cli = clientes.find((c) => c.nombre === turno.cliente)
  return (
    <>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        <DatoFicha etiqueta="Código">{codigo(turno.id)}</DatoFicha>
        <DatoFicha etiqueta="Estado">
          <span className={"chip " + chipDeEstado[turno.estado]}>{rotuloDeEstado[turno.estado]}</span>
        </DatoFicha>
        <DatoFicha etiqueta="Horario">{turno.inicio}&ndash;{finDe(turno.inicio, svc.dur)}</DatoFicha>
        <DatoFicha etiqueta="Duración">{svc.dur} min</DatoFicha>
        <DatoFicha etiqueta="Servicio">{svc.label}</DatoFicha>
        <DatoFicha etiqueta="Precio">{precio(svc.precio)}</DatoFicha>
        <DatoFicha etiqueta="Barbero">{barbero?.nombre ?? "—"}</DatoFicha>
        <DatoFicha etiqueta="Especialidad">{barbero?.especialidad ?? "—"}</DatoFicha>
      </dl>
      {cli && (
        <>
          <h3 className="filete mt-6 inline-block font-heading text-xl tracking-wide text-fg">CLIENTE</h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
            <DatoFicha etiqueta="Teléfono"><span className="tabular-nums">{cli.telefono}</span></DatoFicha>
            <DatoFicha etiqueta="Email"><span className="break-all">{cli.email}</span></DatoFicha>
            <DatoFicha etiqueta="Fidelidad"><span className="capitalize">{cli.fidelidad}</span></DatoFicha>
            <DatoFicha etiqueta="Visitas">{cli.visitas}</DatoFicha>
            <DatoFicha etiqueta="Última visita">{cli.ultimaVisita}</DatoFicha>
            <DatoFicha etiqueta="Gasto acumulado">{precio(cli.gasto)}</DatoFicha>
          </dl>
        </>
      )}
      <AvisoDemo texto={aviso} />
    </>
  )
}

function AccionesFicha({
  turno, sillaLibre, onConfirmar, onMover, onDemo,
}: {
  turno: Turno
  sillaLibre: Barbero | null
  onConfirmar: (id: string) => void
  onMover: (id: string) => void
  onDemo: (t: string) => void
}) {
  const muerto = turno.estado === "cancelado" || turno.estado === "no-vino"
  return (
    <>
      {turno.estado === "pendiente" && (
        <button type="button" onClick={() => onConfirmar(turno.id)} className={botonPrimario}>
          Confirmar turno
        </button>
      )}
      {!muerto && (
        <button
          type="button"
          onClick={() => onMover(turno.id)}
          disabled={!sillaLibre}
          className={botonSecundario + " disabled:opacity-60"}
        >
          {sillaLibre ? `Mover a la silla de ${sillaLibre.nombre.split(" ")[0]}` : "Sin otra silla libre"}
        </button>
      )}
      <button type="button" onClick={() => onDemo("Reprogramar el turno. Demo: no se guardó nada.")} className={botonSecundario}>
        Reprogramar
      </button>
      {!muerto && (
        <button type="button" onClick={() => onDemo("Recordatorio enviado al cliente. Demo: no se guardó nada.")} className={botonSecundario}>
          Enviar recordatorio
        </button>
      )}
    </>
  )
}

function Encabezado({
  barberos, filtro, setFiltro, totalTurnos,
}: { barberos: Barbero[]; filtro: string; setFiltro: (v: string) => void; totalTurnos: number | null }) {
  const chips = [{ id: "todos", nombre: "Todos" }, ...barberos]
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-4xl tracking-wide text-fg">AGENDA</h1>
        <p className="mt-1 text-sm text-muted">
          Hoy · {theme.agenda.apertura}&ndash;{theme.agenda.cierre} ·{" "}
          <span className="font-heading text-lg text-accent">{totalTurnos ?? "—"}</span> turnos activos
        </p>
      </div>
      {/* Estructura titulo-con-filtros: chips de barbero reemplazan al buscador. */}
      <div role="group" aria-label="Filtrar por barbero" className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = filtro === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFiltro(c.id)}
              aria-pressed={active}
              className={
                "chip chip-btn transition-colors " +
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
  barbero, turnos, libreEn, nowMin, onAbrir,
}: {
  barbero: Barbero
  turnos: Turno[]
  libreEn: number | null
  nowMin: number | null
  onAbrir: (id: string) => void
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
        <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-2xl tracking-wide text-surface ring-2 ring-laton ring-offset-2 ring-offset-surface">
          {barbero.inicial}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-heading text-xl tracking-wide text-fg">{barbero.nombre}</h2>
          <div className="mt-0.5 flex items-center gap-1.5">
            {/* Ocupada = tinta; libre = verde. El rojo/oxblood queda para error y marca. */}
            <span aria-hidden="true" className={"h-2 w-2 rounded-full " + (ocupada ? "bg-primary" : "bg-success")} />
            <span className="text-xs text-muted">
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
              <span className="font-heading text-sm tracking-widest text-laton-ink">LIBRE</span>
              <span className="text-xs text-muted">{f}</span>
            </div>
          )
        )}

        {/* Bloques-turno. Cada uno es un <button> que abre la ficha: ahi viven el detalle y las
            acciones. El bloque mide lo que dura el servicio; el de una franja (30 min) muestra
            hora + estado y cliente, y el de 60+ min suma servicio y precio. */}
        {turnos.map((t) => {
          const svc = theme.servicios[t.servicio]
          const muerto = t.estado === "cancelado" || t.estado === "no-vino"
          const compacto = svc.dur <= franjaMin
          const rango = `${t.inicio}–${finDe(t.inicio, svc.dur)}`
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onAbrir(t.id)}
              aria-label={`${svc.label}, ${t.cliente}, ${rango}, ${rotuloDeEstado[t.estado]}, ${precio(svc.precio)}. Abrir ficha del turno`}
              className="absolute inset-x-1.5 z-[1] flex flex-col overflow-hidden rounded bg-bg text-left"
              style={{ top: topDe(t.inicio) + 2, height: altoDe(svc.dur) - 4 }}
            >
              {/* Tinte del servicio (capa aparte para que el bloque sea opaco). */}
              <span
                aria-hidden="true"
                className={"pointer-events-none absolute inset-0 rounded border " + bloqueDeTinte[svc.tinte] + (muerto ? " opacity-60" : "")}
              />
              <span className="relative flex flex-1 flex-col justify-between px-2.5 py-1">
                <span className="flex items-center justify-between gap-1">
                  <span className="font-heading text-sm leading-5 tracking-wide text-fg/70">{rango}</span>
                  <span className="rounded-[var(--badge-radius)] bg-surface">
                    <span className={"chip py-0 leading-4 " + chipDeEstado[t.estado]}>{rotuloDeEstado[t.estado]}</span>
                  </span>
                </span>
                <span className={"truncate font-heading text-lg leading-5 tracking-wide text-fg " + (muerto ? "line-through" : "")}>
                  {t.cliente}
                </span>
                {!compacto && (
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs uppercase tracking-wide text-fg/70">{svc.label}</span>
                    <span className="font-heading text-base tracking-wide text-accent">{precio(svc.precio)}</span>
                  </span>
                )}
              </span>
            </button>
          )
        })}

        {/* Linea "ahora" de laton, cruza la columna. Quieta: no late. */}
        {nowMin !== null && nowMin >= aperturaMin && nowMin <= cierreMin && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
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
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
      <span className="font-heading text-sm tracking-widest">SERVICIO</span>
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={"h-3 w-4 rounded border " + i.cls} />
          {i.label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className="libre h-3 w-4 rounded" /> Libre: hueco vendible
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-[2px] w-5 bg-laton" /> Ahora
      </span>
    </div>
  )
}
