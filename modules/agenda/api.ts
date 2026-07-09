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
    { id: "1", cliente: "Bruno Alvarez", hora: "09:30", servicio: "Corte + barba", barbero: "Fede", estado: "confirmado" },
    { id: "2", cliente: "Thiago Molina", hora: "10:00", servicio: "Corte fade", barbero: "Nico", estado: "confirmado" },
    { id: "3", cliente: "Ivan Rios", hora: "10:30", servicio: "Perfilado de barba", barbero: "Emi", estado: "confirmado" },
    { id: "4", cliente: "Franco Villalba", hora: "11:00", servicio: "Corte clasico", barbero: "Tobias", estado: "pendiente" },
    { id: "5", cliente: "Emiliano Sosa", hora: "11:30", servicio: "Corte + diseno", barbero: "Fede", estado: "confirmado" },
    { id: "6", cliente: "Matias Ojeda", hora: "12:00", servicio: "Afeitado clasico", barbero: "Nico", estado: "cancelado" },
    { id: "7", cliente: "Gonzalo Bustos", hora: "12:30", servicio: "Corte maquina", barbero: "Emi", estado: "confirmado" },
    { id: "8", cliente: "Julian Sequeira", hora: "13:00", servicio: "Corte + barba", barbero: "Tobias", estado: "pendiente" },
    { id: "9", cliente: "Facundo Aguirre", hora: "14:00", servicio: "Corte fade", barbero: "Fede", estado: "confirmado" },
    { id: "10", cliente: "Santiago Correa", hora: "14:30", servicio: "Barba + toalla caliente", barbero: "Nico", estado: "confirmado" },
    { id: "11", cliente: "Benjamin Toledo", hora: "15:00", servicio: "Corte nino", barbero: "Emi", estado: "confirmado" },
    { id: "12", cliente: "Agustin Miranda", hora: "15:30", servicio: "Corte + diseno", barbero: "Tobias", estado: "pendiente" },
    { id: "13", cliente: "Lautaro Godoy", hora: "16:00", servicio: "Corte clasico", barbero: "Fede", estado: "confirmado" },
    { id: "14", cliente: "Ignacio Vera", hora: "16:30", servicio: "Corte + barba", barbero: "Nico", estado: "cancelado" },
    { id: "15", cliente: "Ezequiel Ponce", hora: "17:00", servicio: "Corte fade", barbero: "Emi", estado: "confirmado" },
    { id: "16", cliente: "Kevin Maidana", hora: "17:30", servicio: "Color / decoloracion", barbero: "Tobias", estado: "pendiente" },
    { id: "17", cliente: "Alan Figueroa", hora: "18:00", servicio: "Perfilado de barba", barbero: "Fede", estado: "confirmado" },
    { id: "18", cliente: "Rodrigo Nunez", hora: "18:30", servicio: "Corte + barba", barbero: "Nico", estado: "confirmado" },
    { id: "19", cliente: "Leandro Sanabria", hora: "19:00", servicio: "Corte maquina", barbero: "Emi", estado: "pendiente" },
    { id: "20", cliente: "Cristian Paez", hora: "19:30", servicio: "Corte + diseno", barbero: "Tobias", estado: "confirmado" },
    { id: "21", cliente: "Gaston Vega", hora: "20:00", servicio: "Afeitado clasico", barbero: "Fede", estado: "cancelado" },
    { id: "22", cliente: "Joaquin Aparicio", hora: "20:30", servicio: "Corte fade + cera", barbero: "Nico", estado: "confirmado" },
  ]
}
