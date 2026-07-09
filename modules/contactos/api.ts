// PATRON MOCK. Misma firma que la query real. Reetiquetado para barberia.
// Datos ficticios con forma realista: emails de patron VARIADO (ver CLAUDE.md §8),
// telefonos AR con prefijos de distintas ciudades. Ningun dato real.
export type Contact = {
  id: string
  name: string
  phone: string
  email: string
  barbero: string
  status: "activo" | "nuevo" | "por volver" | "perdido"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getContacts(): Promise<Contact[]> {
  await sleep(300)
  return [
    { id: "1", name: "Bruno Alvarez", phone: "+54 9 11 4783-2610", email: "bruno.alvarez@gmail.com", barbero: "Fede", status: "activo" },
    { id: "2", name: "Thiago Molina", phone: "+54 9 11 6294-1187", email: "tmolina@outlook.com", barbero: "Nico", status: "activo" },
    { id: "3", name: "Lucas Ferreyra", phone: "+54 9 351 320-8074", email: "ferreyra.lucas@hotmail.com", barbero: "Emi", status: "activo" },
    { id: "4", name: "Emiliano Sosa", phone: "+54 9 11 5840-3962", email: "emi.sosa90@gmail.com", barbero: "Fede", status: "nuevo" },
    { id: "5", name: "Ramiro Cabrera", phone: "+54 9 341 297-6431", email: "ramiro_cabrera@yahoo.com", barbero: "Tobias", status: "por volver" },
    { id: "6", name: "Ivan Rios", phone: "+54 9 11 7013-5528", email: "ivanrios@gmail.com", barbero: "Nico", status: "activo" },
    { id: "7", name: "Nahuel Ledesma", phone: "+54 9 261 480-9173", email: "nledesma77@hotmail.com", barbero: "Emi", status: "activo" },
    { id: "8", name: "Tobias Peralta", phone: "+54 9 11 6672-2049", email: "tobias.peralta@gmail.com", barbero: "Fede", status: "activo" },
    { id: "9", name: "Franco Villalba", phone: "+54 9 11 3390-7715", email: "fvillalba@outlook.com", barbero: "Nico", status: "nuevo" },
    { id: "10", name: "Matias Ojeda", phone: "+54 9 351 621-4486", email: "ojeda.matias@hotmail.com", barbero: "Tobias", status: "activo" },
    { id: "11", name: "Gonzalo Bustos", phone: "+54 9 11 8842-3057", email: "gonza.bustos88@gmail.com", barbero: "Emi", status: "por volver" },
    { id: "12", name: "Julian Sequeira", phone: "+54 9 11 4550-7268", email: "julian_sequeira@yahoo.com", barbero: "Fede", status: "activo" },
    { id: "13", name: "Facundo Aguirre", phone: "+54 9 341 902-6614", email: "facundoaguirre@gmail.com", barbero: "Nico", status: "activo" },
    { id: "14", name: "Santiago Correa", phone: "+54 9 11 6134-8890", email: "scorrea@outlook.com", barbero: "Emi", status: "activo" },
    { id: "15", name: "Benjamin Toledo", phone: "+54 9 261 502-6640", email: "toledo.benjamin@hotmail.com", barbero: "Tobias", status: "nuevo" },
    { id: "16", name: "Agustin Miranda", phone: "+54 9 11 2117-4903", email: "agus.miranda91@gmail.com", barbero: "Fede", status: "activo" },
    { id: "17", name: "Dylan Cardozo", phone: "+54 9 11 7446-2085", email: "dylan_cardozo@yahoo.com", barbero: "Nico", status: "perdido" },
    { id: "18", name: "Maximo Herrera", phone: "+54 9 11 3852-6640", email: "mherrera@navajabarber.com", barbero: "Emi", status: "activo" },
    { id: "19", name: "Lautaro Godoy", phone: "+54 9 351 573-1264", email: "lautaro.godoy@gmail.com", barbero: "Tobias", status: "activo" },
    { id: "20", name: "Ignacio Vera", phone: "+54 9 11 2965-8317", email: "ivera83@hotmail.com", barbero: "Fede", status: "por volver" },
    { id: "21", name: "Ezequiel Ponce", phone: "+54 9 341 670-4429", email: "eze_ponce@yahoo.com", barbero: "Nico", status: "activo" },
    { id: "22", name: "Kevin Maidana", phone: "+54 9 11 5240-9976", email: "kmaidana@outlook.com", barbero: "Emi", status: "nuevo" },
    { id: "23", name: "Alan Figueroa", phone: "+54 9 261 801-7352", email: "figueroa.alan@hotmail.com", barbero: "Tobias", status: "activo" },
    { id: "24", name: "Rodrigo Nunez", phone: "+54 9 11 3623-5108", email: "rnunez@outlook.com", barbero: "Fede", status: "activo" },
    { id: "25", name: "Damian Rey", phone: "+54 9 11 9584-2731", email: "damian_rey@yahoo.com", barbero: "Nico", status: "perdido" },
    { id: "26", name: "Leandro Sanabria", phone: "+54 9 351 143-6650", email: "lsanabria@outlook.com", barbero: "Emi", status: "activo" },
    { id: "27", name: "Cristian Paez", phone: "+54 9 11 7062-3384", email: "paez.cristian@hotmail.com", barbero: "Tobias", status: "por volver" },
    { id: "28", name: "Gaston Vega", phone: "+54 9 11 2851-9047", email: "gaston.vega@navajabarber.com", barbero: "Fede", status: "activo" },
    { id: "29", name: "Marcos Britez", phone: "+54 9 341 617-2079", email: "mbritez79@hotmail.com", barbero: "Nico", status: "nuevo" },
    { id: "30", name: "Joaquin Aparicio", phone: "+54 9 11 4718-8562", email: "joaquin_aparicio@yahoo.com", barbero: "Emi", status: "activo" },
  ]
}
