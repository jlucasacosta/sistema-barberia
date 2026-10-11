// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Ventas es un KANBAN del flujo de cobro del dia: cada ticket avanza de columna.
// En el backend real el estado sale de `cobros.estado` y los items del join con `servicios`/`productos`.
import raw from "./data.json"

export type EstadoCobro = "pendiente" | "cobrado" | "rechazado"

export type Ticket = {
  id: string
  cliente: string
  barbero: string
  items: string[]
  total: number
  metodo: "Efectivo" | "Tarjeta" | "Transferencia" | "QR"
  hora: string
  estado: EstadoCobro
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ~28 tickets con estados mezclados (incluye rechazados).
export async function getTickets(): Promise<Ticket[]> {
  await sleep(280)
  return structuredClone(raw.tickets) as Ticket[]
}
