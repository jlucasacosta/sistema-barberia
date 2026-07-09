"use client"
import { useEffect, useState } from "react"
import { getVentas, type Venta } from "./api"

// Mapas literales: Tailwind necesita ver la clase completa en el fuente.
const medioBadge: Record<Venta["medio"], string> = {
  efectivo: "bg-success/15 text-success",
  tarjeta: "bg-info/15 text-info",
  transferencia: "bg-accent/15 text-accent",
}

const estadoBadge: Record<Venta["estado"], string> = {
  cobrado: "bg-success/15 text-success",
  pendiente: "bg-warning/15 text-warning",
  rechazado: "bg-danger/15 text-danger",
}

export function VentasPage() {
  const [rows, setRows] = useState<Venta[]>([])
  useEffect(() => {
    getVentas().then(setRows)
  }, [])

  const cobradas = rows.filter((v) => v.estado === "cobrado").length
  const rechazadas = rows.filter((v) => v.estado === "rechazado").length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Cobros</h1>
        <div className="flex gap-2">
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-success">{cobradas}</span> <span className="text-muted">cobrados</span>
          </span>
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-danger">{rechazadas}</span> <span className="text-muted">rechazados</span>
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted">
            <tr>
              <th className="p-4 font-medium">Fecha</th>
              <th className="p-4 font-medium">Cliente</th>
              <th className="p-4 font-medium">Detalle</th>
              <th className="p-4 font-medium">Medio</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-border transition-colors last:border-0 hover:bg-subtle">
                <td className="p-4 text-muted">{v.fecha}</td>
                <td className="p-4 font-medium">{v.cliente}</td>
                <td className="p-4 text-muted">{v.detalle}</td>
                <td className="p-4">
                  <span className={"whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs " + medioBadge[v.medio]}>
                    {v.medio}
                  </span>
                </td>
                <td className="p-4">
                  <span className={"rounded-full px-2.5 py-0.5 text-xs " + estadoBadge[v.estado]}>{v.estado}</span>
                </td>
                <td className="p-4 text-right font-semibold">{v.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
