"use client"
import { useEffect, useState } from "react"
import { Clock, Scissors } from "lucide-react"
import { getTurnos, type Turno } from "./api"

const estadoBadge: Record<Turno["estado"], string> = {
  confirmado: "bg-primary text-bg",
  pendiente: "bg-subtle text-accent",
  cancelado: "bg-subtle text-muted",
}

export function AgendaPage() {
  const [rows, setRows] = useState<Turno[]>([])
  useEffect(() => {
    getTurnos().then(setRows)
  }, [])

  const activos = rows.filter((t) => t.estado !== "cancelado")

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Turnos de hoy</h1>
        <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
          <span className="font-semibold">{activos.length}</span> <span className="text-muted">turnos activos</span>
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-5 rounded-xl bg-surface p-4 shadow-card transition-shadow hover:shadow-pop"
          >
            <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-subtle py-2">
              <Clock size={16} className="text-muted" />
              <span className="mt-1 text-sm font-semibold">{t.hora}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{t.cliente}</p>
              <p className="flex items-center gap-1 text-sm text-muted">
                <Scissors size={13} />
                {t.servicio}
              </p>
            </div>
            <span className="text-sm text-muted">{t.barbero}</span>
            <span className={"rounded-full px-2.5 py-0.5 text-xs " + estadoBadge[t.estado]}>{t.estado}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
