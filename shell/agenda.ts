// agenda.ts · El reloj de la barberia, en un solo lugar.
// Traduce las constantes de dominio del theme (apertura, cierre, franja, servicios)
// a posicion/alto de bloque y a CLASES LITERALES. Ningun componente inventa un
// numero magico ni escribe un color: solo pide la posicion o la clase.
import { theme } from "./theme"

export type Tinte = "corte" | "barba" | "combo"
export type EstadoTurno = "pendiente" | "confirmado" | "cancelado" | "no-vino"

export function hhmmToMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}
export function minToHHMM(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export const aperturaMin = hhmmToMin(theme.agenda.apertura)
export const cierreMin = hhmmToMin(theme.agenda.cierre)
export const franjaMin = theme.agenda.franjaMin
export const franjaPx = theme.agenda.franjaPx
export const totalFranjas = Math.round((cierreMin - aperturaMin) / franjaMin)
export const rejillaPx = totalFranjas * franjaPx

// Lista de etiquetas de franja para el gutter horario.
export const franjas: string[] = Array.from({ length: totalFranjas }, (_, i) => minToHHMM(aperturaMin + i * franjaMin))

// Posicion vertical de un turno segun su hora de inicio.
export function topDe(inicio: string): number {
  return ((hhmmToMin(inicio) - aperturaMin) / franjaMin) * franjaPx
}
// Alto de un turno segun la duracion (en min) del servicio.
export function altoDe(durMin: number): number {
  return (durMin / franjaMin) * franjaPx
}
// Fin (HH:MM) de un turno.
export function finDe(inicio: string, durMin: number): string {
  return minToHHMM(hhmmToMin(inicio) + durMin)
}

// Mapas literales: Tailwind NO ve clases armadas por concatenacion (`bg-${x}`).
// Tinte del bloque-turno por familia de servicio (todo sale de tokens del theme).
export const bloqueDeTinte: Record<Tinte, string> = {
  corte: "bg-info/10 border-info/45",
  barba: "bg-accent/10 border-accent/40",
  combo: "bg-accent/20 border-laton",
}
// Chip square de estado del turno.
export const chipDeEstado: Record<EstadoTurno, string> = {
  pendiente: "bg-warning/15 text-warning border border-warning/45",
  confirmado: "bg-success/15 text-success border border-success/45",
  cancelado: "bg-danger/12 text-danger border border-danger/40",
  "no-vino": "bg-muted/15 text-muted border border-muted/40",
}
export const rotuloDeEstado: Record<EstadoTurno, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
  "no-vino": "No vino",
}

// Formatea un precio con la moneda del theme.
export function precio(n: number): string {
  return `${theme.moneda}${n.toLocaleString("es-AR")}`
}
