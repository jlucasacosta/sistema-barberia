"use client"
import { useEffect, useState } from "react"
import { getContacts, type Contact } from "./api"

const badge: Record<Contact["status"], string> = {
  activo: "bg-primary text-bg",
  nuevo: "bg-subtle text-primary",
  perdido: "bg-subtle text-muted",
}

export function ContactosPage() {
  const [rows, setRows] = useState<Contact[]>([])
  useEffect(() => {
    getContacts().then(setRows)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Contactos</h1>
      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted">
            <tr>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Telefono</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border transition-colors last:border-0 hover:bg-subtle">
                <td className="p-4 font-medium">{r.name}</td>
                <td className="p-4 text-muted">{r.phone}</td>
                <td className="p-4 text-muted">{r.email}</td>
                <td className="p-4">
                  <span className={"rounded-full px-2.5 py-0.5 text-xs " + badge[r.status]}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
