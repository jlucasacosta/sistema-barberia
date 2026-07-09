// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Venta = {
  id: string
  fecha: string
  cliente: string
  detalle: string
  medio: "efectivo" | "tarjeta" | "transferencia"
  estado: "cobrado" | "pendiente" | "rechazado"
  total: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getVentas(): Promise<Venta[]> {
  await sleep(300)
  return [
    { id: "1", fecha: "Hoy 20:30", cliente: "Joaquin Aparicio", detalle: "Corte fade + cera", medio: "tarjeta", estado: "cobrado", total: "$ 6.100" },
    { id: "2", fecha: "Hoy 19:30", cliente: "Cristian Paez", detalle: "Corte + diseno", medio: "efectivo", estado: "cobrado", total: "$ 5.900" },
    { id: "3", fecha: "Hoy 18:30", cliente: "Rodrigo Nunez", detalle: "Corte + barba", medio: "transferencia", estado: "cobrado", total: "$ 6.400" },
    { id: "4", fecha: "Hoy 18:00", cliente: "Alan Figueroa", detalle: "Perfilado de barba", medio: "tarjeta", estado: "rechazado", total: "$ 3.200" },
    { id: "5", fecha: "Hoy 17:00", cliente: "Ezequiel Ponce", detalle: "Corte fade", medio: "efectivo", estado: "cobrado", total: "$ 4.600" },
    { id: "6", fecha: "Hoy 16:00", cliente: "Lautaro Godoy", detalle: "Corte clasico", medio: "tarjeta", estado: "cobrado", total: "$ 4.200" },
    { id: "7", fecha: "Hoy 15:00", cliente: "Benjamin Toledo", detalle: "Corte nino", medio: "efectivo", estado: "cobrado", total: "$ 3.500" },
    { id: "8", fecha: "Hoy 14:30", cliente: "Santiago Correa", detalle: "Barba + toalla caliente", medio: "transferencia", estado: "pendiente", total: "$ 3.800" },
    { id: "9", fecha: "Hoy 14:00", cliente: "Facundo Aguirre", detalle: "Corte fade", medio: "tarjeta", estado: "cobrado", total: "$ 4.600" },
    { id: "10", fecha: "Hoy 12:30", cliente: "Gonzalo Bustos", detalle: "Corte maquina", medio: "efectivo", estado: "cobrado", total: "$ 3.400" },
    { id: "11", fecha: "Hoy 11:30", cliente: "Emiliano Sosa", detalle: "Corte + diseno", medio: "tarjeta", estado: "cobrado", total: "$ 5.900" },
    { id: "12", fecha: "Hoy 10:30", cliente: "Ivan Rios", detalle: "Perfilado de barba", medio: "transferencia", estado: "cobrado", total: "$ 3.200" },
    { id: "13", fecha: "Hoy 10:00", cliente: "Thiago Molina", detalle: "Corte fade", medio: "efectivo", estado: "cobrado", total: "$ 4.600" },
    { id: "14", fecha: "Hoy 09:30", cliente: "Bruno Alvarez", detalle: "Corte + barba", medio: "tarjeta", estado: "cobrado", total: "$ 6.400" },
    { id: "15", fecha: "Ayer 20:15", cliente: "Damian Rey", detalle: "Corte + barba + cera", medio: "tarjeta", estado: "rechazado", total: "$ 6.800" },
    { id: "16", fecha: "Ayer 19:40", cliente: "Kevin Maidana", detalle: "Color / decoloracion", medio: "transferencia", estado: "cobrado", total: "$ 9.500" },
    { id: "17", fecha: "Ayer 18:50", cliente: "Agustin Miranda", detalle: "Corte + diseno", medio: "efectivo", estado: "cobrado", total: "$ 5.900" },
    { id: "18", fecha: "Ayer 17:35", cliente: "Franco Villalba", detalle: "Corte clasico", medio: "tarjeta", estado: "cobrado", total: "$ 4.200" },
    { id: "19", fecha: "Ayer 16:20", cliente: "Matias Ojeda", detalle: "Afeitado clasico", medio: "efectivo", estado: "pendiente", total: "$ 3.600" },
    { id: "20", fecha: "Ayer 15:10", cliente: "Julian Sequeira", detalle: "Corte + barba", medio: "transferencia", estado: "cobrado", total: "$ 6.400" },
    { id: "21", fecha: "Ayer 13:45", cliente: "Nahuel Ledesma", detalle: "Corte fade + cera", medio: "tarjeta", estado: "cobrado", total: "$ 6.100" },
    { id: "22", fecha: "Ayer 12:00", cliente: "Tobias Peralta", detalle: "Corte maquina", medio: "efectivo", estado: "cobrado", total: "$ 3.400" },
    { id: "23", fecha: "Ayer 10:30", cliente: "Gaston Vega", detalle: "Corte + barba", medio: "tarjeta", estado: "cobrado", total: "$ 6.400" },
    { id: "24", fecha: "Sab 19:20", cliente: "Leandro Sanabria", detalle: "Corte + diseno", medio: "transferencia", estado: "cobrado", total: "$ 5.900" },
    { id: "25", fecha: "Sab 18:05", cliente: "Marcos Britez", detalle: "Corte fade", medio: "efectivo", estado: "cobrado", total: "$ 4.600" },
    { id: "26", fecha: "Sab 16:40", cliente: "Dylan Cardozo", detalle: "Barba + toalla caliente", medio: "tarjeta", estado: "rechazado", total: "$ 3.800" },
    { id: "27", fecha: "Sab 15:15", cliente: "Ignacio Vera", detalle: "Corte clasico", medio: "efectivo", estado: "cobrado", total: "$ 4.200" },
    { id: "28", fecha: "Sab 13:30", cliente: "Ramiro Cabrera", detalle: "Corte + barba + cera", medio: "transferencia", estado: "cobrado", total: "$ 6.800" },
  ]
}
