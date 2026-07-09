"use client"
// CONTACTOS · arquetipo tabla-densa. Filas compactas de ficha de cliente, numerales
// en Bebas. Filtro por chips de barbero (reemplaza al buscador). Color de tokens.
import { useEffect, useMemo, useState } from "react"
import { precio } from "@/shell/agenda"
import { getClientes, type Cliente } from "./api"

const chipFidelidad: Record<Cliente["fidelidad"], string> = {
  nuevo: "chip border border-info/40 bg-info/10 text-info",
  habitual: "chip border border-border bg-subtle/60 text-muted",
  vip: "chip border border-laton bg-laton/12 text-laton",
}

export function ContactosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtro, setFiltro] = useState<string>("todos")

  useEffect(() => {
    getClientes().then(setClientes)
  }, [])

  const barberos = useMemo(() => Array.from(new Set(clientes.map((c) => c.barberoFijo))), [clientes])
  const filtrados = filtro === "todos" ? clientes : clientes.filter((c) => c.barberoFijo === filtro)

  return (
    <div className="mx-auto max-w-[1300px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl tracking-wide text-fg">CLIENTES</h1>
          <p className="mt-1 text-sm text-muted">
            <span className="font-heading text-lg text-accent">{filtrados.length}</span> fichas ·{" "}
            {filtrados.filter((c) => c.fidelidad === "vip").length} VIP
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

      <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-laton/50 text-left font-heading text-base tracking-wide text-muted">
              <th className="px-4 py-2.5 font-normal">Cliente</th>
              <th className="px-3 py-2.5 font-normal">Contacto</th>
              <th className="px-3 py-2.5 font-normal">Barbero</th>
              <th className="px-3 py-2.5 font-normal">Servicio habitual</th>
              <th className="px-3 py-2.5 text-center font-normal">Ult. visita</th>
              <th className="px-3 py-2.5 text-center font-normal">Visitas</th>
              <th className="px-4 py-2.5 text-right font-normal">Gasto</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c, i) => (
              <tr key={c.id} className={"border-b border-border/70 " + (i % 2 ? "bg-bg/40" : "")}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fg">{c.nombre}</span>
                    <span className={chipFidelidad[c.fidelidad]}>{c.fidelidad}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-muted">
                  <div className="tabular-nums">{c.telefono}</div>
                  <div className="text-xs">{c.email}</div>
                </td>
                <td className="px-3 py-2 text-fg/80">{c.barberoFijo}</td>
                <td className="px-3 py-2 text-fg/80">{c.servicioHabitual}</td>
                <td className="px-3 py-2 text-center font-heading text-base tracking-wide text-muted">{c.ultimaVisita}</td>
                <td className="px-3 py-2 text-center font-heading text-lg tracking-wide text-fg">{c.visitas}</td>
                <td className="px-4 py-2 text-right font-heading text-lg tracking-wide text-accent">{precio(c.gasto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
