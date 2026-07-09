"use client"
import { useEffect, useState } from "react"
import { getContacts, type Contact } from "./api"

// Mapas literales: Tailwind necesita ver la clase completa en el fuente.
const badge: Record<Contact["status"], string> = {
  activo: "bg-success/15 text-success",
  nuevo: "bg-info/15 text-info",
  "por volver": "bg-warning/15 text-warning",
  perdido: "bg-danger/15 text-danger",
}

const avatar: Record<Contact["status"], string> = {
  activo: "bg-success/15 text-success",
  nuevo: "bg-info/15 text-info",
  "por volver": "bg-warning/15 text-warning",
  perdido: "bg-danger/15 text-danger",
}

const iniciales = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")

export function ContactosPage() {
  const [rows, setRows] = useState<Contact[]>([])
  useEffect(() => {
    getContacts().then(setRows)
  }, [])

  const perdidos = rows.filter((r) => r.status === "perdido").length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Clientes</h1>
        <div className="flex gap-2">
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold">{rows.length}</span> <span className="text-muted">en total</span>
          </span>
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-danger">{perdidos}</span> <span className="text-muted">sin volver</span>
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted">
            <tr>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Telefono</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Barbero</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border transition-colors last:border-0 hover:bg-subtle">
                <td className="p-4">
                  <span className="flex items-center gap-3">
                    <span
                      className={
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
                        avatar[r.status]
                      }
                    >
                      {iniciales(r.name)}
                    </span>
                    <span className="font-medium">{r.name}</span>
                  </span>
                </td>
                <td className="p-4 text-muted">{r.phone}</td>
                <td className="p-4 text-muted">{r.email}</td>
                <td className="p-4 text-muted">{r.barbero}</td>
                <td className="p-4">
                  <span className={"whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs " + badge[r.status]}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
