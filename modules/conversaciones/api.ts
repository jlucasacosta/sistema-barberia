// PATRON MOCK. Misma firma que la query real. Reetiquetado para barberia.
export type Thread = { id: string; name: string; last: string; time: string; unread: number }
export type Message = { id: string; from: "cliente" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return [
    { id: "1", name: "Bruno Alvarez", last: "Perfecto, saco turno para el sabado", time: "15:02", unread: 1 },
    { id: "2", name: "Thiago Molina", last: "Hacen diseno con maquina?", time: "13:40", unread: 0 },
    { id: "3", name: "Lucas Fereyra", last: "Cuanto sale corte + barba?", time: "12:15", unread: 0 },
    { id: "4", name: "Emiliano Sosa", last: "Tenes lugar hoy a la tarde?", time: "10:50", unread: 2 },
  ]
}

export async function getMessages(_threadId: string): Promise<Message[]> {
  await sleep(200)
  return [
    { id: "1", from: "cliente", text: "Hola! Queria sacar un turno para corte", time: "14:48" },
    { id: "2", from: "vos", text: "Hola Bruno! Tengo lugar el sabado 11:00 o 16:30", time: "14:52" },
    { id: "3", from: "cliente", text: "El de las 11 me viene barbaro", time: "14:58" },
    { id: "4", from: "vos", text: "Listo, te agendo corte + barba a las 11", time: "15:00" },
    { id: "5", from: "cliente", text: "Perfecto, saco turno para el sabado", time: "15:02" },
  ]
}
