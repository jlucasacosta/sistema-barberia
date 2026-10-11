"use client"
// CONTACTOS · arquetipo tabla-densa. Filas compactas de ficha de cliente, numerales
// en Bebas. Filtro por chips de barbero (reemplaza al buscador). Color de tokens.
// El nombre de cada fila abre la ficha del cliente (FichaLateral); en celular la tabla
// muestra solo cliente y gasto, y el resto vive en la ficha.
import { useMemo, useState } from "react"
import { theme } from "@/shell/theme"
import { precio, rotuloDeEstado, finDe } from "@/shell/agenda"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"
import { getTurnos } from "@/modules/agenda/api"
import { getTickets } from "@/modules/ventas/api"
import { getClientes, type Cliente } from "./api"

const chipFidelidad: Record<Cliente["fidelidad"], string> = {
  nuevo: "chip border border-info/40 bg-info/10 text-info-ink",
  habitual: "chip border border-border bg-subtle/60 text-muted",
  vip: "chip border border-laton bg-laton/12 text-laton-ink",
}
const rotuloCobro = { pendiente: "por cobrar", cobrado: "cobrado", rechazado: "rechazado" } as const
const codigo = (id: string) => `CL-${id.padStart(3, "0")}`
const cargarContactos = () => Promise.all([getClientes(), getTurnos(), getTickets()])

export function ContactosPage() {
  const { data, error, cargando, reintentar } = useCarga(cargarContactos)
  const clientes = data?.[0] ?? []
  const [filtro, setFiltro] = useState<string>("todos")
  const [sel, setSel] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const barberos = useMemo(() => Array.from(new Set(clientes.map((c) => c.barberoFijo))), [clientes])
  const filtrados = filtro === "todos" ? clientes : clientes.filter((c) => c.barberoFijo === filtro)
  const cliente = clientes.find((c) => c.id === sel) ?? null
  const listo = !cargando && !error

  function abrir(id: string) {
    setAviso(null)
    setSel(id)
  }

  return (
    <div className="mx-auto max-w-[1300px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl tracking-wide text-fg">CONTACTOS</h1>
          <p className="mt-1 text-sm text-muted">
            <span className="font-heading text-lg text-accent">{listo ? filtrados.length : "—"}</span> clientes ·{" "}
            {listo ? filtrados.filter((c) => c.fidelidad === "vip").length : "—"} VIP
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
          <ErrorCarga mensaje="No pudimos cargar los clientes." onReintentar={reintentar} />
        </div>
      ) : (
        <div
          role="region"
          aria-label="Tabla de clientes (desplazable)"
          aria-busy={cargando}
          tabIndex={0}
          className="mt-5 overflow-x-auto rounded-xl border border-border bg-surface"
        >
          {cargando ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Esqueleto key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Clientes: contacto, barbero, servicio habitual, última visita, visitas y gasto. El nombre abre la ficha.</caption>
              <thead>
                <tr className="border-b-2 border-laton/50 text-left font-heading text-base tracking-wide text-muted">
                  <th scope="col" className="hidden px-4 py-2.5 font-normal lg:table-cell">Código</th>
                  <th scope="col" className="px-4 py-2.5 font-normal">Cliente</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-normal md:table-cell">Contacto</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-normal md:table-cell">Barbero</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-normal lg:table-cell">Servicio habitual</th>
                  <th scope="col" className="hidden px-3 py-2.5 text-center font-normal md:table-cell">Últ. visita</th>
                  <th scope="col" className="hidden px-3 py-2.5 text-center font-normal md:table-cell">Visitas</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-normal">Gasto</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c, i) => (
                  <tr
                    key={c.id}
                    onClick={() => abrir(c.id)}
                    className={"cursor-pointer border-b border-border/70 hover:bg-subtle/50 " + (i % 2 ? "bg-bg/40" : "")}
                  >
                    <td className="hidden px-4 py-2 text-xs text-muted tabular-nums lg:table-cell">{codigo(c.id)}</td>
                    <th scope="row" className="px-4 py-2 text-left font-normal">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            abrir(c.id)
                          }}
                          aria-label={`Abrir ficha de ${c.nombre}`}
                          className="text-left font-medium text-fg hover:underline"
                        >
                          {c.nombre}
                        </button>
                        <span className={chipFidelidad[c.fidelidad]}>{c.fidelidad}</span>
                      </div>
                      <div className="mt-0.5 text-xs tabular-nums text-muted md:hidden">{c.telefono}</div>
                    </th>
                    <td className="hidden px-3 py-2 text-muted md:table-cell">
                      <div className="tabular-nums">{c.telefono}</div>
                      <div className="text-xs">{c.email}</div>
                    </td>
                    <td className="hidden px-3 py-2 text-fg/80 md:table-cell">{c.barberoFijo}</td>
                    <td className="hidden px-3 py-2 text-fg/80 lg:table-cell">{c.servicioHabitual}</td>
                    <td className="hidden px-3 py-2 text-center font-heading text-base tracking-wide text-muted md:table-cell">{c.ultimaVisita}</td>
                    <td className="hidden px-3 py-2 text-center font-heading text-lg tracking-wide text-fg md:table-cell">{c.visitas}</td>
                    <td className="px-4 py-2 text-right font-heading text-lg tracking-wide text-accent">{precio(c.gasto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <FichaLateral
        abierta={!!cliente}
        titulo={cliente ? cliente.nombre : ""}
        subtitulo={cliente ? `Cliente ${codigo(cliente.id)}` : undefined}
        onCerrar={() => setSel(null)}
        acciones={
          cliente && (
            <>
              <button type="button" onClick={() => setAviso("Turno nuevo agendado para el cliente. Demo: no se guardó nada.")} className={botonPrimario}>
                Agendar turno
              </button>
              <button type="button" onClick={() => setAviso("Recordatorio enviado por WhatsApp. Demo: no se guardó nada.")} className={botonSecundario}>
                Enviar recordatorio
              </button>
              <button type="button" onClick={() => setAviso("Promoción enviada al cliente. Demo: no se guardó nada.")} className={botonSecundario}>
                Enviar promoción
              </button>
            </>
          )
        }
      >
        {cliente && data && <FichaCliente c={cliente} turnos={data[1]} tickets={data[2]} aviso={aviso} />}
      </FichaLateral>
    </div>
  )
}

function FichaCliente({
  c, turnos, tickets, aviso,
}: {
  c: Cliente
  turnos: Awaited<ReturnType<typeof getTurnos>>
  tickets: Awaited<ReturnType<typeof getTickets>>
  aviso: string | null
}) {
  // Lo que se puede derivar de la data existente: el turno y el ticket de hoy, y el gasto por visita.
  const turno = turnos.find((t) => t.cliente === c.nombre)
  const ticket = tickets.find((t) => t.cliente === c.nombre)
  const svc = turno ? theme.servicios[turno.servicio] : null
  return (
    <>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        <DatoFicha etiqueta="Código">{codigo(c.id)}</DatoFicha>
        <DatoFicha etiqueta="Fidelidad"><span className={chipFidelidad[c.fidelidad]}>{c.fidelidad}</span></DatoFicha>
        <DatoFicha etiqueta="Teléfono"><span className="tabular-nums">{c.telefono}</span></DatoFicha>
        <DatoFicha etiqueta="Email"><span className="break-all">{c.email}</span></DatoFicha>
        <DatoFicha etiqueta="Barbero fijo">{c.barberoFijo}</DatoFicha>
        <DatoFicha etiqueta="Servicio habitual">{c.servicioHabitual}</DatoFicha>
        <DatoFicha etiqueta="Última visita">{c.ultimaVisita}</DatoFicha>
        <DatoFicha etiqueta="Visitas">{c.visitas}</DatoFicha>
        <DatoFicha etiqueta="Gasto acumulado">{precio(c.gasto)}</DatoFicha>
        <DatoFicha etiqueta="Gasto por visita">{precio(Math.round(c.gasto / Math.max(1, c.visitas)))}</DatoFicha>
      </dl>
      <h3 className="filete mt-6 inline-block font-heading text-xl tracking-wide text-fg">HOY</h3>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
        <DatoFicha etiqueta="Turno">
          {turno && svc ? `${turno.inicio}–${finDe(turno.inicio, svc.dur)} · ${svc.label} · ${rotuloDeEstado[turno.estado]}` : "Sin turno hoy"}
        </DatoFicha>
        <DatoFicha etiqueta="Cobro">
          {ticket ? `${precio(ticket.total)} · ${rotuloCobro[ticket.estado]}` : "Sin ticket hoy"}
        </DatoFicha>
      </dl>
      <AvisoDemo texto={aviso} />
    </>
  )
}
