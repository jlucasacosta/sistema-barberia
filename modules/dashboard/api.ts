// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Hub de reojo al cierre: ocupacion por barbero (anillos), ranking de servicios
// (barras) y feed de actividad. En el backend real todo sale de vistas agregadas.
export type Ocupacion = { barberoId: string; nombre: string; inicial: string; pct: number; turnos: number }
export type RankItem = { label: string; valor: number }
export type Actividad = { hora: string; texto: string; tipo: "cobro" | "turno" | "rechazo" | "mensaje" }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getOcupacion(): Promise<Ocupacion[]> {
  await sleep(200)
  return [
    { barberoId: "b1", nombre: "Tobias", inicial: "TA", pct: 0.82, turnos: 6 },
    { barberoId: "b2", nombre: "Ramiro", inicial: "RV", pct: 0.68, turnos: 6 },
    { barberoId: "b3", nombre: "Nicolas", inicial: "NB", pct: 0.75, turnos: 6 },
    { barberoId: "b4", nombre: "Emiliano", inicial: "ES", pct: 0.54, turnos: 4 },
  ]
}

export async function getRankingServicios(): Promise<RankItem[]> {
  await sleep(220)
  return [
    { label: "Corte clasico", valor: 9 },
    { label: "Corte + barba", valor: 7 },
    { label: "Fade", valor: 4 },
    { label: "Ritual completo", valor: 3 },
    { label: "Barba", valor: 3 },
    { label: "Perfilado", valor: 2 },
  ]
}

export async function getActividad(): Promise<Actividad[]> {
  await sleep(240)
  return [
    { hora: "18:02", texto: "Damian Roldan reservo Corte + barba con Ramiro", tipo: "turno" },
    { hora: "17:35", texto: "Cobro $750 · Lucas Ibarra · QR", tipo: "cobro" },
    { hora: "17:10", texto: "Federico Nunez confirmo turno de las 17:30", tipo: "turno" },
    { hora: "16:48", texto: "Pago RECHAZADO · Matias Ferreyra · tarjeta", tipo: "rechazo" },
    { hora: "16:20", texto: "Cobro $1.100 · Hernan Ledesma · efectivo", tipo: "cobro" },
    { hora: "15:55", texto: "Nuevo mensaje de Bruno Ferre (Instagram)", tipo: "mensaje" },
    { hora: "15:40", texto: "Cobro $1.050 · Marco Aramburu · tarjeta", tipo: "cobro" },
    { hora: "15:12", texto: "Andres Godoy (cliente nuevo) reservo Barba", tipo: "turno" },
    { hora: "14:30", texto: "Pago RECHAZADO · Dario Quinteros · tarjeta", tipo: "rechazo" },
    { hora: "13:20", texto: "Cobro $750 · Joaquin Medina · QR", tipo: "cobro" },
    { hora: "12:05", texto: "Nuevo mensaje de Gaston Rivero (WhatsApp)", tipo: "mensaje" },
    { hora: "11:30", texto: "Nahuel Ojeda cancelo su turno de las 11:30", tipo: "rechazo" },
  ]
}
