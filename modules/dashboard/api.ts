// PATRON MOCK. Misma firma que la query real. Reetiquetado para barberia.
export type Kpi = { label: string; value: string; delta: number }
export type SalesPoint = { label: string; value: number }
export type Activity = { id: string; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getKpis(): Promise<Kpi[]> {
  await sleep(300)
  return [
    { label: "Turnos hoy", value: "27", delta: 7 },
    { label: "Cortes esta semana", value: "148", delta: 11 },
    { label: "Ticket promedio", value: "$ 5.200", delta: 5 },
    { label: "Clientes nuevos", value: "12", delta: -4 },
  ]
}

export async function getSales(): Promise<SalesPoint[]> {
  await sleep(300)
  return [
    { label: "Lun", value: 14 },
    { label: "Mar", value: 21 },
    { label: "Mie", value: 18 },
    { label: "Jue", value: 26 },
    { label: "Vie", value: 34 },
    { label: "Sab", value: 41 },
    { label: "Dom", value: 0 },
  ]
}

export async function getActivity(): Promise<Activity[]> {
  await sleep(300)
  return [
    { id: "1", text: "Nuevo turno: corte + barba a las 18:00", time: "hace 4 min" },
    { id: "2", text: "Venta registrada: corte fade + cera ($ 6.100)", time: "hace 25 min" },
    { id: "3", text: "Cliente reprogramo turno del viernes", time: "hace 1 h" },
    { id: "4", text: "Reseña nueva: 5 estrellas por el degrade", time: "hace 3 h" },
  ]
}
