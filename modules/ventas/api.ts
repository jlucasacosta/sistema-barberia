// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Venta = {
  id: string
  fecha: string
  cliente: string
  detalle: string
  medio: "efectivo" | "tarjeta" | "transferencia"
  total: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getVentas(): Promise<Venta[]> {
  await sleep(300)
  return [
    { id: "1", fecha: "Hoy 18:20", cliente: "Bruno Alvarez", detalle: "Corte + barba", medio: "tarjeta", total: "$ 6.100" },
    { id: "2", fecha: "Hoy 17:05", cliente: "Thiago Molina", detalle: "Corte fade + cera", medio: "efectivo", total: "$ 5.400" },
    { id: "3", fecha: "Hoy 15:40", cliente: "Lucas Fereyra", detalle: "Perfilado de barba", medio: "transferencia", total: "$ 3.200" },
    { id: "4", fecha: "Hoy 13:10", cliente: "Ivan Rios", detalle: "Corte + diseno", medio: "tarjeta", total: "$ 5.900" },
    { id: "5", fecha: "Ayer 19:30", cliente: "Ramiro Cabrera", detalle: "Corte clasico", medio: "efectivo", total: "$ 4.200" },
    { id: "6", fecha: "Ayer 18:00", cliente: "Emiliano Sosa", detalle: "Corte + barba + cera", medio: "tarjeta", total: "$ 6.800" },
  ]
}
