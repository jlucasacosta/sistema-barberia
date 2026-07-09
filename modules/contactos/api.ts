// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Ficha de cliente en filas densas. En el backend real sale de `clientes` con
// agregados (ultima_visita, gasto_acumulado, visitas) calculados por vista.
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
  return [
    { id: "1", nombre: "Ivan Peralta", telefono: "+54 9 341 618 2047", email: "ivan.peralta@mail.com", ultimaVisita: "08/07", barberoFijo: "Tobias", servicioHabitual: "Corte clasico", visitas: 14, gasto: 6300, fidelidad: "vip" },
    { id: "2", nombre: "Alejo Barrios", telefono: "+54 9 351 274 9938", email: "abarrios@gmail.com", ultimaVisita: "08/07", barberoFijo: "Nicolas", servicioHabitual: "Corte + barba", visitas: 9, gasto: 6750, fidelidad: "vip" },
    { id: "3", nombre: "Lautaro Micheloud", telefono: "+54 9 342 903 1174", email: "lauti.m@hotmail.com", ultimaVisita: "08/07", barberoFijo: "Tobias", servicioHabitual: "Fade", visitas: 22, gasto: 11550, fidelidad: "vip" },
    { id: "4", nombre: "Julian Escobar", telefono: "+54 9 261 445 7280", email: "j.escobar@proton.me", ultimaVisita: "08/07", barberoFijo: "Ramiro", servicioHabitual: "Barba", visitas: 6, gasto: 2100, fidelidad: "habitual" },
    { id: "5", nombre: "Tomas Aguirre", telefono: "+54 9 381 620 3391", email: "tomasaguirre@outlook.com", ultimaVisita: "08/07", barberoFijo: "Nicolas", servicioHabitual: "Corte clasico", visitas: 3, gasto: 1350, fidelidad: "habitual" },
    { id: "6", nombre: "Cristian Maldonado", telefono: "+54 9 299 517 8842", email: "cristian.m@mail.com", ultimaVisita: "07/07", barberoFijo: "Emiliano", servicioHabitual: "Ritual completo", visitas: 11, gasto: 12100, fidelidad: "vip" },
    { id: "7", nombre: "Sergio Villalba", telefono: "+54 9 388 214 6675", email: "svillalba@gmail.com", ultimaVisita: "07/07", barberoFijo: "Ramiro", servicioHabitual: "Perfilado", visitas: 8, gasto: 3200, fidelidad: "habitual" },
    { id: "8", nombre: "Pablo Zarate", telefono: "+54 9 223 806 1159", email: "pablo.zarate@yahoo.com", ultimaVisita: "07/07", barberoFijo: "Emiliano", servicioHabitual: "Corte + barba", visitas: 5, gasto: 3750, fidelidad: "habitual" },
    { id: "9", nombre: "Marco Aramburu", telefono: "+54 9 341 972 4408", email: "m.aramburu@proton.me", ultimaVisita: "06/07", barberoFijo: "Tobias", servicioHabitual: "Corte + barba", visitas: 17, gasto: 12750, fidelidad: "vip" },
    { id: "10", nombre: "Lucas Ibarra", telefono: "+54 9 351 338 5027", email: "lucasibarra@mail.com", ultimaVisita: "06/07", barberoFijo: "Nicolas", servicioHabitual: "Corte + barba", visitas: 2, gasto: 1500, fidelidad: "nuevo" },
    { id: "11", nombre: "Gaston Rivero", telefono: "+54 9 264 719 6683", email: "grivero@hotmail.com", ultimaVisita: "06/07", barberoFijo: "Tobias", servicioHabitual: "Corte + barba", visitas: 7, gasto: 5250, fidelidad: "habitual" },
    { id: "12", nombre: "Rodrigo Cabral", telefono: "+54 9 387 502 3318", email: "rodri.cabral@gmail.com", ultimaVisita: "05/07", barberoFijo: "Nicolas", servicioHabitual: "Corte clasico", visitas: 4, gasto: 1800, fidelidad: "habitual" },
    { id: "13", nombre: "Facundo Leiva", telefono: "+54 9 291 447 9902", email: "fleiva@outlook.com", ultimaVisita: "05/07", barberoFijo: "Ramiro", servicioHabitual: "Ritual completo", visitas: 13, gasto: 14300, fidelidad: "vip" },
    { id: "14", nombre: "Andres Godoy", telefono: "+54 9 342 615 7734", email: "andres.godoy@mail.com", ultimaVisita: "05/07", barberoFijo: "Emiliano", servicioHabitual: "Barba", visitas: 1, gasto: 350, fidelidad: "nuevo" },
    { id: "15", nombre: "Ezequiel Sosa", telefono: "+54 9 358 209 4471", email: "ezequiel.sosa@yahoo.com", ultimaVisita: "04/07", barberoFijo: "Ramiro", servicioHabitual: "Barba", visitas: 10, gasto: 4200, fidelidad: "vip" },
    { id: "16", nombre: "Federico Nunez", telefono: "+54 9 341 880 2265", email: "fnunez@proton.me", ultimaVisita: "04/07", barberoFijo: "Nicolas", servicioHabitual: "Corte clasico", visitas: 6, gasto: 2700, fidelidad: "habitual" },
    { id: "17", nombre: "Bruno Ferre", telefono: "+54 9 351 733 6690", email: "brunoferre@gmail.com", ultimaVisita: "04/07", barberoFijo: "Tobias", servicioHabitual: "Fade", visitas: 3, gasto: 1650, fidelidad: "habitual" },
    { id: "18", nombre: "Hernan Ledesma", telefono: "+54 9 299 618 3327", email: "h.ledesma@mail.com", ultimaVisita: "03/07", barberoFijo: "Emiliano", servicioHabitual: "Ritual completo", visitas: 9, gasto: 9900, fidelidad: "vip" },
    { id: "19", nombre: "Damian Roldan", telefono: "+54 9 261 904 5518", email: "damian.roldan@hotmail.com", ultimaVisita: "03/07", barberoFijo: "Ramiro", servicioHabitual: "Corte + barba", visitas: 5, gasto: 3750, fidelidad: "habitual" },
    { id: "20", nombre: "Santiago Correa", telefono: "+54 9 381 246 7783", email: "scorrea@outlook.com", ultimaVisita: "03/07", barberoFijo: "Ramiro", servicioHabitual: "Barba", visitas: 12, gasto: 6400, fidelidad: "vip" },
    { id: "21", nombre: "Joaquin Medina", telefono: "+54 9 341 559 8804", email: "joaquin.medina@mail.com", ultimaVisita: "02/07", barberoFijo: "Emiliano", servicioHabitual: "Corte + barba", visitas: 2, gasto: 1500, fidelidad: "nuevo" },
    { id: "22", nombre: "Franco Duarte", telefono: "+54 9 351 902 3346", email: "fduarte@gmail.com", ultimaVisita: "02/07", barberoFijo: "Nicolas", servicioHabitual: "Fade", visitas: 8, gasto: 4400, fidelidad: "habitual" },
    { id: "23", nombre: "Agustin Ferrari", telefono: "+54 9 342 118 6659", email: "agus.ferrari@proton.me", ultimaVisita: "02/07", barberoFijo: "Tobias", servicioHabitual: "Corte clasico", visitas: 15, gasto: 6750, fidelidad: "vip" },
    { id: "24", nombre: "Leandro Cardozo", telefono: "+54 9 388 640 2237", email: "lcardozo@yahoo.com", ultimaVisita: "01/07", barberoFijo: "Ramiro", servicioHabitual: "Perfilado", visitas: 4, gasto: 1200, fidelidad: "habitual" },
    { id: "25", nombre: "Emanuel Rios", telefono: "+54 9 264 337 9915", email: "emanuel.rios@mail.com", ultimaVisita: "01/07", barberoFijo: "Tobias", servicioHabitual: "Corte clasico", visitas: 1, gasto: 450, fidelidad: "nuevo" },
    { id: "26", nombre: "Nahuel Ojeda", telefono: "+54 9 299 725 4408", email: "nojeda@hotmail.com", ultimaVisita: "30/06", barberoFijo: "Ramiro", servicioHabitual: "Corte + barba", visitas: 6, gasto: 4500, fidelidad: "habitual" },
    { id: "27", nombre: "Dario Quinteros", telefono: "+54 9 351 480 6672", email: "dario.q@gmail.com", ultimaVisita: "29/06", barberoFijo: "Tobias", servicioHabitual: "Fade", visitas: 7, gasto: 3850, fidelidad: "habitual" },
    { id: "28", nombre: "Matias Ferreyra", telefono: "+54 9 341 206 5583", email: "matiasferreyra@outlook.com", ultimaVisita: "28/06", barberoFijo: "Nicolas", servicioHabitual: "Corte clasico", visitas: 20, gasto: 9000, fidelidad: "vip" },
    { id: "29", nombre: "Cristobal Vera", telefono: "+54 9 387 913 2248", email: "cristobal.vera@proton.me", ultimaVisita: "27/06", barberoFijo: "Emiliano", servicioHabitual: "Ritual completo", visitas: 3, gasto: 3300, fidelidad: "habitual" },
    { id: "30", nombre: "Tobias Guzman", telefono: "+54 9 261 508 7791", email: "tguzman@mail.com", ultimaVisita: "26/06", barberoFijo: "Nicolas", servicioHabitual: "Corte clasico", visitas: 5, gasto: 2250, fidelidad: "habitual" },
  ]
}
