// PATRON MOCK. Misma firma que la query real. Reetiquetado para barberia.
export type Thread = { id: string; name: string; last: string; time: string; unread: number }
export type Message = { id: string; from: "cliente" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return [
    { id: "1", name: "Bruno Alvarez", last: "Perfecto, saco turno para el sabado", time: "15:02", unread: 1 },
    { id: "2", name: "Thiago Molina", last: "Hacen diseno con maquina?", time: "14:38", unread: 2 },
    { id: "3", name: "Lucas Ferreyra", last: "Cuanto sale corte + barba?", time: "13:55", unread: 0 },
    { id: "4", name: "Emiliano Sosa", last: "Se me hizo tarde, puedo llegar 10 min despues?", time: "13:20", unread: 3 },
    { id: "5", name: "Kevin Maidana", last: "El color lo hacen el mismo dia?", time: "12:47", unread: 1 },
    { id: "6", name: "Franco Villalba", last: "Atienden sin turno los martes?", time: "12:10", unread: 0 },
    { id: "7", name: "Matias Ojeda", last: "Tengo que cancelar el de las 12, disculpa", time: "11:32", unread: 0 },
    { id: "8", name: "Santiago Correa", last: "Aceptan transferencia?", time: "11:05", unread: 1 },
    { id: "9", name: "Ivan Rios", last: "Gracias, quedo excelente el degrade", time: "10:40", unread: 0 },
    { id: "10", name: "Benjamin Toledo", last: "Cortan a nenes de 6 anios?", time: "10:12", unread: 0 },
    { id: "11", name: "Agustin Miranda", last: "Fede trabaja este viernes?", time: "09:38", unread: 0 },
    { id: "12", name: "Ezequiel Ponce", last: "Me paso la direccion de nuevo?", time: "09:04", unread: 2 },
    { id: "13", name: "Lautaro Godoy", last: "Listo, nos vemos a las 16", time: "Ayer", unread: 0 },
    { id: "14", name: "Gaston Vega", last: "Todo bien, gracias por avisar", time: "Ayer", unread: 0 },
  ]
}

const conversaciones: Record<string, Message[]> = {
  "1": [
    { id: "1", from: "cliente", text: "Hola! Queria sacar un turno para corte", time: "14:48" },
    { id: "2", from: "vos", text: "Hola Bruno! Tengo lugar el sabado 11:00 o 16:30", time: "14:52" },
    { id: "3", from: "cliente", text: "El de las 11 me viene barbaro", time: "14:58" },
    { id: "4", from: "vos", text: "Listo, te agendo corte + barba a las 11 con Fede", time: "15:00" },
    { id: "5", from: "cliente", text: "Perfecto, saco turno para el sabado", time: "15:02" },
  ],
  "2": [
    { id: "1", from: "cliente", text: "Buenas! Hacen diseno con maquina?", time: "14:20" },
    { id: "2", from: "vos", text: "Hola Thiago! Si, Nico hace lineas y diseños", time: "14:26" },
    { id: "3", from: "cliente", text: "Cuanto sale corte + diseno?", time: "14:31" },
    { id: "4", from: "vos", text: "Corte + diseño te queda en $ 5.900", time: "14:35" },
    { id: "5", from: "cliente", text: "Hacen diseno con maquina?", time: "14:38" },
  ],
  "4": [
    { id: "1", from: "cliente", text: "Hola, tengo turno a las 15:30 hoy", time: "13:05" },
    { id: "2", from: "vos", text: "Hola Emiliano! Si, con Tobias, corte + diseño", time: "13:10" },
    { id: "3", from: "cliente", text: "Se me complico el laburo", time: "13:16" },
    { id: "4", from: "vos", text: "Sin drama, si llegas hasta 15:45 lo sostenemos", time: "13:18" },
    { id: "5", from: "cliente", text: "Se me hizo tarde, puedo llegar 10 min despues?", time: "13:20" },
  ],
  "5": [
    { id: "1", from: "cliente", text: "Hola! Consulta por color de pelo", time: "12:30" },
    { id: "2", from: "vos", text: "Hola Kevin! Hacemos color y decoloracion", time: "12:36" },
    { id: "3", from: "cliente", text: "Cuanto tiempo lleva?", time: "12:41" },
    { id: "4", from: "vos", text: "Entre 90 y 120 min segun el tono. Sale $ 9.500", time: "12:44" },
    { id: "5", from: "cliente", text: "El color lo hacen el mismo dia?", time: "12:47" },
  ],
  "7": [
    { id: "1", from: "cliente", text: "Hola, tenia turno a las 12 con Nico", time: "11:20" },
    { id: "2", from: "vos", text: "Hola Matias! Si, corte fade, lo veo agendado", time: "11:26" },
    { id: "3", from: "cliente", text: "Me surgio un imprevisto y no llego", time: "11:29" },
    { id: "4", from: "vos", text: "Gracias por avisar, lo liberamos. Reagendamos?", time: "11:31" },
    { id: "5", from: "cliente", text: "Tengo que cancelar el de las 12, disculpa", time: "11:32" },
  ],
}

const generico: Message[] = [
  { id: "1", from: "cliente", text: "Hola! Consulta rapida sobre la barberia", time: "09:10" },
  { id: "2", from: "vos", text: "Hola! Contame, te ayudo", time: "09:14" },
  { id: "3", from: "cliente", text: "Que horario tienen de atencion?", time: "09:20" },
  { id: "4", from: "vos", text: "Martes a sabado de 9 a 21, con turno o por orden", time: "09:26" },
  { id: "5", from: "cliente", text: "Perfecto, gracias!", time: "09:31" },
]

export async function getMessages(threadId: string): Promise<Message[]> {
  await sleep(200)
  return conversaciones[threadId] ?? generico
}
