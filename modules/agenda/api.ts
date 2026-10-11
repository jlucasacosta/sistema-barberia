// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// La agenda no es una lista: es una GRILLA por barbero. Cada turno tiene barbero,
// hora de inicio, servicio (define alto y color) y estado. En el backend real el
// barbero sale de `barberos`, el turno de `turnos` y el servicio del join con `servicios`.
import { theme } from "@/shell/theme"
import type { EstadoTurno } from "@/shell/agenda"
import raw from "./data.json"

export type Barbero = {
  id: string
  nombre: string
  inicial: string // dos letras para el avatar (sin foto: sin derechos de imagen)
  especialidad: string
}

export type Turno = {
  id: string
  barberoId: string
  inicio: string // "HH:MM", alineado a franjas de 30 min
  servicio: keyof typeof theme.servicios
  cliente: string
  estado: EstadoTurno
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getBarberos(): Promise<Barbero[]> {
  await sleep(220)
  return structuredClone(raw.barberos) as Barbero[]
}

// ~22 turnos repartidos entre 4 barberos y las franjas del dia (09:00-20:00).
// Estados mezclados: pendiente, confirmado, cancelado, no-vino.
export async function getTurnos(): Promise<Turno[]> {
  await sleep(300)
  return structuredClone(raw.turnos) as Turno[]
}
