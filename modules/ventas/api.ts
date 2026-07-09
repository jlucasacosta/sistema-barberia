// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Ventas es un KANBAN del flujo de cobro del dia: cada ticket avanza de columna.
// En el backend real el estado sale de `cobros.estado` y los items del join con `servicios`/`productos`.
export type EstadoCobro = "pendiente" | "cobrado" | "rechazado"

export type Ticket = {
  id: string
  cliente: string
  barbero: string
  items: string[]
  total: number
  metodo: "Efectivo" | "Tarjeta" | "Transferencia" | "QR"
  hora: string
  estado: EstadoCobro
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ~28 tickets con estados mezclados (incluye rechazados).
export async function getTickets(): Promise<Ticket[]> {
  await sleep(280)
  return [
    { id: "c01", cliente: "Ivan Peralta", barbero: "Tobias", items: ["Corte clasico"], total: 450, metodo: "Efectivo", hora: "10:35", estado: "cobrado" },
    { id: "c02", cliente: "Alejo Barrios", barbero: "Nicolas", items: ["Corte clasico", "Cera fijadora"], total: 750, metodo: "Tarjeta", hora: "09:40", estado: "cobrado" },
    { id: "c03", cliente: "Lautaro Micheloud", barbero: "Tobias", items: ["Fade"], total: 550, metodo: "QR", hora: "09:35", estado: "cobrado" },
    { id: "c04", cliente: "Julian Escobar", barbero: "Ramiro", items: ["Barba"], total: 350, metodo: "Efectivo", hora: "10:05", estado: "cobrado" },
    { id: "c05", cliente: "Tomas Aguirre", barbero: "Nicolas", items: ["Corte clasico"], total: 450, metodo: "Transferencia", hora: "10:35", estado: "cobrado" },
    { id: "c06", cliente: "Cristian Maldonado", barbero: "Emiliano", items: ["Ritual completo"], total: 1100, metodo: "Tarjeta", hora: "11:30", estado: "cobrado" },
    { id: "c07", cliente: "Sergio Villalba", barbero: "Ramiro", items: ["Perfilado", "Aceite de barba"], total: 800, metodo: "QR", hora: "11:05", estado: "cobrado" },
    { id: "c08", cliente: "Pablo Zarate", barbero: "Emiliano", items: ["Corte + barba"], total: 750, metodo: "Efectivo", hora: "13:00", estado: "cobrado" },
    { id: "c09", cliente: "Marco Aramburu", barbero: "Tobias", items: ["Corte + barba", "Shampoo solido"], total: 1050, metodo: "Tarjeta", hora: "15:40", estado: "cobrado" },
    { id: "c10", cliente: "Lucas Ibarra", barbero: "Nicolas", items: ["Corte + barba"], total: 750, metodo: "QR", hora: "16:10", estado: "cobrado" },
    // Pendientes (en curso / por cobrar)
    { id: "c11", cliente: "Gaston Rivero", barbero: "Tobias", items: ["Corte + barba"], total: 750, metodo: "Efectivo", hora: "11:00", estado: "pendiente" },
    { id: "c12", cliente: "Rodrigo Cabral", barbero: "Nicolas", items: ["Corte clasico"], total: 450, metodo: "Tarjeta", hora: "11:00", estado: "pendiente" },
    { id: "c13", cliente: "Facundo Leiva", barbero: "Ramiro", items: ["Ritual completo", "Aceite de barba"], total: 1550, metodo: "QR", hora: "14:00", estado: "pendiente" },
    { id: "c14", cliente: "Andres Godoy", barbero: "Emiliano", items: ["Barba"], total: 350, metodo: "Efectivo", hora: "14:30", estado: "pendiente" },
    { id: "c15", cliente: "Ezequiel Sosa", barbero: "Ramiro", items: ["Barba", "Cera fijadora"], total: 650, metodo: "Transferencia", hora: "16:30", estado: "pendiente" },
    { id: "c16", cliente: "Federico Nunez", barbero: "Nicolas", items: ["Corte clasico"], total: 450, metodo: "QR", hora: "17:30", estado: "pendiente" },
    { id: "c17", cliente: "Bruno Ferre", barbero: "Tobias", items: ["Fade"], total: 550, metodo: "Tarjeta", hora: "17:00", estado: "pendiente" },
    { id: "c18", cliente: "Hernan Ledesma", barbero: "Emiliano", items: ["Ritual completo"], total: 1100, metodo: "Efectivo", hora: "16:00", estado: "pendiente" },
    { id: "c19", cliente: "Damian Roldan", barbero: "Ramiro", items: ["Corte + barba"], total: 750, metodo: "QR", hora: "18:00", estado: "pendiente" },
    // Rechazados (el problema visible)
    { id: "c20", cliente: "Nahuel Ojeda", barbero: "Ramiro", items: ["Corte + barba"], total: 750, metodo: "Tarjeta", hora: "11:30", estado: "rechazado" },
    { id: "c21", cliente: "Dario Quinteros", barbero: "Tobias", items: ["Fade"], total: 550, metodo: "Tarjeta", hora: "12:30", estado: "rechazado" },
    { id: "c22", cliente: "Matias Ferreyra", barbero: "Nicolas", items: ["Corte clasico"], total: 450, metodo: "QR", hora: "13:00", estado: "rechazado" },
    // Mas cobrados para volumen
    { id: "c23", cliente: "Emanuel Rios", barbero: "Tobias", items: ["Corte clasico"], total: 450, metodo: "Efectivo", hora: "12:10", estado: "cobrado" },
    { id: "c24", cliente: "Santiago Correa", barbero: "Ramiro", items: ["Barba", "Aceite de barba"], total: 800, metodo: "Tarjeta", hora: "12:40", estado: "cobrado" },
    { id: "c25", cliente: "Joaquin Medina", barbero: "Emiliano", items: ["Corte + barba"], total: 750, metodo: "QR", hora: "13:30", estado: "cobrado" },
    { id: "c26", cliente: "Franco Duarte", barbero: "Nicolas", items: ["Fade", "Cera fijadora"], total: 750, metodo: "Efectivo", hora: "14:15", estado: "cobrado" },
    { id: "c27", cliente: "Agustin Ferrari", barbero: "Tobias", items: ["Corte clasico"], total: 450, metodo: "Transferencia", hora: "15:00", estado: "cobrado" },
    { id: "c28", cliente: "Leandro Cardozo", barbero: "Ramiro", items: ["Perfilado"], total: 300, metodo: "QR", hora: "15:20", estado: "cobrado" },
  ]
}
