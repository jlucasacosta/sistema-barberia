// PATRON MOCK. Misma firma que la query real. Reetiquetado para barberia.
export type Contact = {
  id: string
  name: string
  phone: string
  email: string
  status: "activo" | "nuevo" | "perdido"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getContacts(): Promise<Contact[]> {
  await sleep(300)
  return [
    { id: "1", name: "Bruno Alvarez", phone: "+54 11 5555 1234", email: "bruno@mail.com", status: "activo" },
    { id: "2", name: "Thiago Molina", phone: "+54 11 5555 2233", email: "thiago@mail.com", status: "activo" },
    { id: "3", name: "Lucas Fereyra", phone: "+54 11 5555 7788", email: "lucasf@mail.com", status: "nuevo" },
    { id: "4", name: "Emiliano Sosa", phone: "+54 11 5555 3311", email: "emiliano@mail.com", status: "nuevo" },
    { id: "5", name: "Ramiro Cabrera", phone: "+54 11 5555 9021", email: "ramiro@mail.com", status: "perdido" },
  ]
}
