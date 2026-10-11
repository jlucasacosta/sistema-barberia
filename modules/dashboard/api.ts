// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Hub de reojo al cierre: ocupacion por barbero (anillos), ranking de servicios
// (barras) y feed de actividad. En el backend real todo sale de vistas agregadas.
import raw from "./data.json"

export type Ocupacion = { barberoId: string; nombre: string; inicial: string; pct: number; turnos: number }
export type RankItem = { label: string; valor: number }
export type Actividad = { hora: string; texto: string; tipo: "cobro" | "turno" | "rechazo" | "mensaje" }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getOcupacion(): Promise<Ocupacion[]> {
  await sleep(200)
  return structuredClone(raw.ocupacion) as Ocupacion[]
}

export async function getRankingServicios(): Promise<RankItem[]> {
  await sleep(220)
  return structuredClone(raw.rankingServicios) as RankItem[]
}

export async function getActividad(): Promise<Actividad[]> {
  await sleep(240)
  return structuredClone(raw.actividad) as Actividad[]
}
