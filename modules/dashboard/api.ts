// PATRON MOCK. Misma firma que la query real. Reetiquetado para barberia.
export type Tone = "primary" | "accent" | "success" | "warning" | "danger" | "info"
export type Kpi = { label: string; value: string; delta: number; tone: Tone }
export type SalesPoint = { label: string; value: number }
export type Activity = { id: string; text: string; time: string; tone: Tone }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getKpis(): Promise<Kpi[]> {
  await sleep(300)
  return [
    { label: "Turnos hoy", value: "27", delta: 7, tone: "primary" },
    { label: "Cortes esta semana", value: "148", delta: 11, tone: "info" },
    { label: "Ticket promedio", value: "$ 5.200", delta: 5, tone: "success" },
    { label: "Ausencias del mes", value: "8", delta: -4, tone: "danger" },
  ]
}

export async function getSales(): Promise<SalesPoint[]> {
  await sleep(300)
  return [
    { label: "Lun", value: 22 },
    { label: "Mar", value: 26 },
    { label: "Mie", value: 19 },
    { label: "Jue", value: 31 },
    { label: "Vie", value: 38 },
    { label: "Sab", value: 44 },
    { label: "Dom", value: 12 },
  ]
}

export async function getActivity(): Promise<Activity[]> {
  await sleep(300)
  return [
    { id: "1", text: "Nuevo turno: Bruno Alvarez, corte + barba 09:30", time: "hace 5 min", tone: "success" },
    { id: "2", text: "Cobro registrado: corte fade + cera ($ 6.100)", time: "hace 22 min", tone: "success" },
    { id: "3", text: "Turno cancelado: Matias Ojeda aviso a ultimo momento", time: "hace 40 min", tone: "danger" },
    { id: "4", text: "Pago rechazado: tarjeta de Alan Figueroa ($ 3.200)", time: "hace 1 h", tone: "danger" },
    { id: "5", text: "Fede libero un cupo de las 16:00 por reprogramacion", time: "hace 2 h", tone: "warning" },
    { id: "6", text: "Reseña nueva: 5 estrellas por el degrade de Nico", time: "hace 3 h", tone: "accent" },
    { id: "7", text: "Cliente nuevo agendado: Kevin Maidana (color)", time: "hace 4 h", tone: "info" },
    { id: "8", text: "Stock bajo: quedan 3 ceras de acabado mate", time: "hace 5 h", tone: "warning" },
    { id: "9", text: "Emi cerro caja del turno tarde sin diferencias", time: "hace 6 h", tone: "primary" },
    { id: "10", text: "Recordatorio enviado a 9 turnos de manana", time: "hace 7 h", tone: "info" },
    { id: "11", text: "Ausencia: Ignacio Vera no se presento a las 16:30", time: "ayer", tone: "danger" },
    { id: "12", text: "Promo lanzada: martes de corte + barba con 15% off", time: "ayer", tone: "accent" },
  ]
}
