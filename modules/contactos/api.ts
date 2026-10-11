// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Ficha de cliente en filas densas. En el backend real sale de `clientes` con
// agregados (ultima_visita, gasto_acumulado, visitas) calculados por vista.
import raw from "./data.json"

export type Cliente = {
  id: string
  nombre: string
  telefono: string
  email: string
  ultimaVisita: string // "DD/MM"
  barberoFijo: string
  servicioHabitual: string
  visitas: number
  gasto: number
  fidelidad: "nuevo" | "habitual" | "vip"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ~30 clientes, emails de patron VARIADO (4+ proveedores, ninguno domina),
// telefonos con digitos variados, fidelidad mezclada.
export async function getClientes(): Promise<Cliente[]> {
  await sleep(260)
  return structuredClone(raw.clientes) as Cliente[]
}
