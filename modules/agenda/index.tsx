"use client"
import { useEffect, useState } from "react"
import { Clock, Scissors } from "lucide-react"
import { getTurnos, type Turno } from "./api"

// Mapas literales: Tailwind necesita ver la clase completa en el fuente.
const estadoBadge: Record<Turno["estado"], string> = {
  confirmado: "bg-success/15 text-success",
  pendiente: "bg-warning/15 text-warning",
  cancelado: "bg-danger/15 text-danger",
}

const horaTint: Record<Turno["estado"], string> = {
  confirmado: "bg-success/10 text-success",
  pendiente: "bg-warning/10 text-warning",
  cancelado: "bg-danger/10 text-danger",
}

export function AgendaPage() {
  const [rows, setRows] = useState<Turno[]>([])
  useEffect(() => {
    getTurnos().then(setRows)
  }, [])

  const confirmados = rows.filter((t) => t.estado === "confirmado").length
  const cancelados = rows.filter((t) => t.estado === "cancelado").length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Turnos de hoy</h1>
        <div className="flex gap-2">
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-success">{confirmados}</span>{" "}
            <span className="text-muted">confirmados</span>
          </span>
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-danger">{cancelados}</span>{" "}
            <span className="text-muted">cancelados</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((t) => (
          <div
            key={t.id}
            className={
              "flex items-center gap-5 rounded-xl bg-surface p-4 shadow-card transition-shadow hover:shadow-pop " +
              (t.estado === "cancelado" ? "opacity-60" : "")
            }
          >
            <div className={"flex w-16 shrink-0 flex-col items-center rounded-lg py-2 " + horaTint[t.estado]}>
              <Clock size={16} />
              <span className="mt-1 text-sm font-semibold">{t.hora}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{t.cliente}</p>
              <p className="flex items-center gap-1 text-sm text-muted">
                <Scissors size={13} />
                {t.servicio}
              </p>
            </div>
            <span className="hidden text-sm text-muted sm:block">{t.barbero}</span>
            <span
              className={"w-24 shrink-0 rounded-full px-2.5 py-0.5 text-center text-xs " + estadoBadge[t.estado]}
            >
              {t.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
