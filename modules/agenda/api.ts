// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Turno = {
  id: string
  cliente: string
  hora: string
  servicio: string
  barbero: string
  estado: "confirmado" | "pendiente" | "cancelado"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getTurnos(): Promise<Turno[]> {
  await sleep(300)
  return [
    { id: "1", cliente: "Bruno Alvarez", hora: "11:00", servicio: "Corte + barba", barbero: "Fede", estado: "confirmado" },
    { id: "2", cliente: "Thiago Molina", hora: "12:00", servicio: "Corte fade", barbero: "Nico", estado: "confirmado" },
    { id: "3", cliente: "Emiliano Sosa", hora: "16:30", servicio: "Corte + diseno", barbero: "Fede", estado: "pendiente" },
    { id: "4", cliente: "Lucas Fereyra", hora: "17:15", servicio: "Perfilado de barba", barbero: "Nico", estado: "confirmado" },
    { id: "5", cliente: "Ramiro Cabrera", hora: "18:00", servicio: "Corte clasico", barbero: "Fede", estado: "cancelado" },
    { id: "6", cliente: "Ivan Rios", hora: "18:45", servicio: "Corte + barba", barbero: "Nico", estado: "pendiente" },
  ]
}
