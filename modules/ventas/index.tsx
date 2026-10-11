"use client"
// VENTAS · arquetipo kanban. Columnas = estado del cobro (por cobrar / cobrado /
// rechazado). Las tarjetas avanzan por boton. Muestra el flujo del dia, no una lista
// muerta. Filtro por chips de barbero (reemplaza al buscador). Todo color de tokens.
// El nombre del cliente de cada tarjeta abre la ficha del ticket (FichaLateral).
import { useEffect, useMemo, useState } from "react"
import { precio } from "@/shell/agenda"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"
import { getClientes } from "@/modules/contactos/api"
import { getTickets, type Ticket, type EstadoCobro } from "./api"

const COLUMNAS: { estado: EstadoCobro; titulo: string; acento: string }[] = [
  { estado: "pendiente", titulo: "Por cobrar", acento: "bg-warning" },
  { estado: "cobrado", titulo: "Cobrado", acento: "bg-success" },
  { estado: "rechazado", titulo: "Rechazado", acento: "bg-danger" },
]

const rotuloCobro: Record<EstadoCobro, string> = { pendiente: "Por cobrar", cobrado: "Cobrado", rechazado: "Rechazado" }
const chipCobro: Record<EstadoCobro, string> = {
  pendiente: "chip border border-warning/45 bg-warning/15 text-warning-ink",
  cobrado: "chip border border-success/45 bg-success/15 text-success-ink",
  rechazado: "chip border border-danger/40 bg-danger/12 text-danger-ink",
}
const chipMetodo = "chip border border-border bg-subtle/60 text-muted"
const codigo = (id: string) => `V-${id.slice(1)}`
const cargarVentas = () => Promise.all([getTickets(), getClientes()])

export function VentasPage() {
  const { data, error, cargando, reintentar } = useCarga(cargarVentas)
  const clientes = data?.[1] ?? []
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filtro, setFiltro] = useState<string>("todos")
  const [sel, setSel] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  // Copia local: cobrar, rechazar y reintentar viven en estado de React (F5 los restaura).
  useEffect(() => {
    if (data) setTickets(data[0])
  }, [data])

  const barberos = useMemo(() => Array.from(new Set(tickets.map((t) => t.barbero))), [tickets])
  const filtrados = filtro === "todos" ? tickets : tickets.filter((t) => t.barbero === filtro)
  const ticket = tickets.find((t) => t.id === sel) ?? null

  function abrir(id: string) {
    setAviso(null)
    setSel(id)
  }
  function mover(id: string, estado: EstadoCobro) {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, estado } : t)))
    setAviso(`Ticket pasado a "${rotuloCobro[estado]}". Demo: no se guardó nada.`)
  }

  const suma = (e: EstadoCobro) => filtrados.filter((t) => t.estado === e).reduce((a, t) => a + t.total, 0)
  const listo = !cargando && !error

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl tracking-wide text-fg">VENTAS</h1>
          {/* Los importes viven aca, una sola vez; las columnas muestran solo cuantos tickets hay. */}
          <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            {COLUMNAS.map((c) => (
              <span key={c.estado}>
                {c.titulo}{" "}
                <span className="font-heading text-lg text-accent">{listo ? precio(suma(c.estado)) : "—"}</span>
              </span>
            ))}
          </p>
        </div>
        <div role="group" aria-label="Filtrar por barbero" className="flex flex-wrap gap-2">
          {["todos", ...barberos].map((b) => {
            const active = filtro === b
            return (
              <button
                key={b}
                type="button"
                onClick={() => setFiltro(b)}
                aria-pressed={active}
                className={
                  "chip chip-btn transition-colors " +
                  (active ? "bg-accent text-surface" : "border border-border bg-surface text-muted hover:border-laton")
                }
              >
                {b === "todos" ? "Todos" : b}
              </button>
            )
          })}
        </div>
      </div>

      {error ? (
        <div className="mt-5">
          <ErrorCarga mensaje="No pudimos cargar las ventas del día." onReintentar={reintentar} />
        </div>
      ) : (
        <div aria-busy={cargando} className="mt-5 grid gap-4 md:grid-cols-3">
          {COLUMNAS.map((col) => {
            const items = filtrados.filter((t) => t.estado === col.estado)
            return (
              <section key={col.estado} aria-label={col.titulo} className="overflow-hidden rounded-xl bg-bg">
                {/* Riel de color del estado: barra propia, no borde (el borde se curva con el radio). */}
                <div aria-hidden="true" className={"h-1 " + col.acento} />
                <div className="flex items-center justify-between px-3 py-2.5">
                  <h2 className="font-heading text-xl tracking-wide text-fg">{col.titulo}</h2>
                  <span className="chip border border-border bg-surface text-muted">{cargando ? "—" : items.length}</span>
                </div>
                <div className="space-y-2.5 px-2.5 pb-3">
                  {cargando && (
                    <>
                      <Esqueleto className="h-28" />
                      <Esqueleto className="h-28" />
                      <Esqueleto className="h-28" />
                    </>
                  )}
                  {items.map((t) => (
                    <TarjetaCobro key={t.id} t={t} onAbrir={abrir} onMover={mover} />
                  ))}
                  {!cargando && items.length === 0 && (
                    <div className="libre rounded px-3 py-6 text-center font-heading tracking-widest text-laton-ink">VACÍO</div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <FichaLateral
        abierta={!!ticket}
        titulo={ticket ? ticket.cliente : ""}
        subtitulo={ticket ? `Ticket ${codigo(ticket.id)}` : undefined}
        onCerrar={() => setSel(null)}
        acciones={ticket && <AccionesFicha t={ticket} onMover={mover} onDemo={setAviso} />}
      >
        {ticket && <FichaTicket t={ticket} cliente={clientes.find((c) => c.nombre === ticket.cliente)} aviso={aviso} />}
      </FichaLateral>
    </div>
  )
}

function FichaTicket({
  t, cliente, aviso,
}: { t: Ticket; cliente: Awaited<ReturnType<typeof getClientes>>[number] | undefined; aviso: string | null }) {
  return (
    <>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        <DatoFicha etiqueta="Código">{codigo(t.id)}</DatoFicha>
        <DatoFicha etiqueta="Estado"><span className={chipCobro[t.estado]}>{rotuloCobro[t.estado]}</span></DatoFicha>
        <DatoFicha etiqueta="Barbero">{t.barbero}</DatoFicha>
        <DatoFicha etiqueta="Hora">{t.hora}</DatoFicha>
        <DatoFicha etiqueta="Método de pago">{t.metodo}</DatoFicha>
        <DatoFicha etiqueta="Total"><span className="font-heading text-xl tracking-wide text-accent">{precio(t.total)}</span></DatoFicha>
      </dl>
      <h3 className="filete mt-6 inline-block font-heading text-xl tracking-wide text-fg">DETALLE</h3>
      <ul className="mt-3 divide-y divide-border/70 text-sm text-fg">
        {t.items.map((it) => (
          <li key={it} className="py-2">{it}</li>
        ))}
      </ul>
      {cliente && (
        <>
          <h3 className="filete mt-6 inline-block font-heading text-xl tracking-wide text-fg">CLIENTE</h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
            <DatoFicha etiqueta="Teléfono"><span className="tabular-nums">{cliente.telefono}</span></DatoFicha>
            <DatoFicha etiqueta="Email"><span className="break-all">{cliente.email}</span></DatoFicha>
            <DatoFicha etiqueta="Visitas">{cliente.visitas}</DatoFicha>
            <DatoFicha etiqueta="Gasto acumulado">{precio(cliente.gasto)}</DatoFicha>
          </dl>
        </>
      )}
      <AvisoDemo texto={aviso} />
    </>
  )
}

function AccionesFicha({
  t, onMover, onDemo,
}: { t: Ticket; onMover: (id: string, e: EstadoCobro) => void; onDemo: (s: string) => void }) {
  return (
    <>
      {t.estado === "pendiente" && (
        <>
          <button type="button" onClick={() => onMover(t.id, "cobrado")} className={botonPrimario}>Cobrar</button>
          <button type="button" onClick={() => onMover(t.id, "rechazado")} className={botonSecundario}>Marcar rechazado</button>
          <button type="button" onClick={() => onDemo("Link de pago enviado al cliente. Demo: no se guardó nada.")} className={botonSecundario}>
            Enviar link de pago
          </button>
        </>
      )}
      {t.estado === "rechazado" && (
        <>
          <button type="button" onClick={() => onMover(t.id, "pendiente")} className={botonPrimario}>Reintentar cobro</button>
          <button type="button" onClick={() => onDemo("Aviso de pago rechazado enviado al cliente. Demo: no se guardó nada.")} className={botonSecundario}>
            Avisar al cliente
          </button>
        </>
      )}
      {t.estado === "cobrado" && (
        <button type="button" onClick={() => onDemo("Comprobante enviado al cliente. Demo: no se guardó nada.")} className={botonPrimario}>
          Enviar comprobante
        </button>
      )}
    </>
  )
}

function TarjetaCobro({
  t, onAbrir, onMover,
}: { t: Ticket; onAbrir: (id: string) => void; onMover: (id: string, e: EstadoCobro) => void }) {
  // Dentro de la tarjeta, los botones de cobro no abren la ficha (stopPropagation).
  const accion = (e: EstadoCobro) => (ev: React.MouseEvent) => {
    ev.stopPropagation()
    onMover(t.id, e)
  }
  return (
    <article onClick={() => onAbrir(t.id)} className="surface-card cursor-pointer p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAbrir(t.id)
            }}
            aria-label={`Abrir ficha del ticket de ${t.cliente}`}
            className="block max-w-full truncate text-left font-heading text-lg leading-tight tracking-wide text-fg hover:underline"
          >
            {t.cliente}
          </button>
          <div className="text-xs uppercase tracking-wide text-muted">
            {codigo(t.id)} · {t.barbero} · {t.hora}
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
                type="button"
                onClick={accion("cobrado")}
                aria-label={`Cobrar el ticket de ${t.cliente}`}
                className="chip chip-btn border border-success/50 bg-success/10 text-success-ink hover:bg-success/20"
              >
                Cobrar ›
              </button>
              <button
                type="button"
                onClick={accion("rechazado")}
                aria-label={`Marcar como rechazado el ticket de ${t.cliente}`}
                className="chip chip-btn border border-danger/40 bg-danger/10 text-danger-ink hover:bg-danger/20"
              >
                Rechazar
              </button>
            </>
          )}
          {t.estado === "rechazado" && (
            <button
              type="button"
              onClick={accion("pendiente")}
              aria-label={`Reintentar el cobro del ticket de ${t.cliente}`}
              className="chip chip-btn border border-warning/50 bg-warning/10 text-warning-ink hover:bg-warning/20"
            >
              Reintentar ‹
            </button>
          )}
          {t.estado === "cobrado" && <span className="chip border border-success/40 bg-success/10 text-success-ink">OK</span>}
        </div>
      </div>
    </article>
  )
}
