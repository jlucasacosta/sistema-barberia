// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Inbox master-detail: hilos a la izquierda, conversacion a la derecha.
// En el backend real los hilos salen de `conversaciones` y los mensajes de `mensajes`.
export type Mensaje = { de: "cliente" | "local"; texto: string; hora: string }
export type Hilo = {
  id: string
  cliente: string
  inicial: string
  canal: "WhatsApp" | "Instagram"
  preview: string
  hora: string
  sinLeer: number
  mensajes: Mensaje[]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 14 hilos.
export async function getHilos(): Promise<Hilo[]> {
  await sleep(240)
  return [
    { id: "h1", cliente: "Gaston Rivero", inicial: "GR", canal: "WhatsApp", preview: "Perfecto, confirmo el combo a las 11", hora: "09:12", sinLeer: 2, mensajes: [
      { de: "cliente", texto: "Hola! Tienen lugar hoy a la manana?", hora: "09:02" },
      { de: "local", texto: "Buenas Gaston! Si, 11:00 con Tobias. Corte + barba?", hora: "09:08" },
      { de: "cliente", texto: "Perfecto, confirmo el combo a las 11", hora: "09:12" },
    ] },
    { id: "h2", cliente: "Ezequiel Sosa", inicial: "ES", canal: "Instagram", preview: "Se puede pagar con QR?", hora: "08:47", sinLeer: 1, mensajes: [
      { de: "cliente", texto: "Buenas, cuanto sale la barba?", hora: "08:40" },
      { de: "local", texto: "Hola Ezequiel! La barba $350, perfilado $300.", hora: "08:44" },
      { de: "cliente", texto: "Se puede pagar con QR?", hora: "08:47" },
    ] },
    { id: "h3", cliente: "Andres Godoy", inicial: "AG", canal: "WhatsApp", preview: "Primera vez que voy, gracias!", hora: "08:20", sinLeer: 0, mensajes: [
      { de: "cliente", texto: "Me recomendaron el lugar, tienen turno hoy?", hora: "08:10" },
      { de: "local", texto: "Bienvenido! 14:30 con Emiliano libre.", hora: "08:15" },
      { de: "cliente", texto: "Primera vez que voy, gracias!", hora: "08:20" },
    ] },
    { id: "h4", cliente: "Marco Aramburu", inicial: "MA", canal: "WhatsApp", preview: "Dale, muevo el turno a las 15", hora: "Ayer", sinLeer: 0, mensajes: [
      { de: "local", texto: "Marco, se nos corrio la agenda. Te paso a las 15?", hora: "Ayer" },
      { de: "cliente", texto: "Dale, muevo el turno a las 15", hora: "Ayer" },
    ] },
    { id: "h5", cliente: "Bruno Ferre", inicial: "BF", canal: "Instagram", preview: "Tienen cera fijadora en venta?", hora: "Ayer", sinLeer: 1, mensajes: [
      { de: "cliente", texto: "Tienen cera fijadora en venta?", hora: "Ayer" },
    ] },
    { id: "h6", cliente: "Damian Roldan", inicial: "DR", canal: "WhatsApp", preview: "Gracias, nos vemos el jueves", hora: "Ayer", sinLeer: 0, mensajes: [
      { de: "local", texto: "Listo Damian, jueves 18:00 con Ramiro.", hora: "Ayer" },
      { de: "cliente", texto: "Gracias, nos vemos el jueves", hora: "Ayer" },
    ] },
    { id: "h7", cliente: "Federico Nunez", inicial: "FN", canal: "WhatsApp", preview: "Puedo llevar a mi hijo tambien?", hora: "Ayer", sinLeer: 3, mensajes: [
      { de: "cliente", texto: "Hola, atienden ninos?", hora: "Ayer" },
      { de: "cliente", texto: "Puedo llevar a mi hijo tambien?", hora: "Ayer" },
    ] },
    { id: "h8", cliente: "Lucas Ibarra", inicial: "LI", canal: "Instagram", preview: "Que horario cierran los sabados?", hora: "Mar", sinLeer: 0, mensajes: [
      { de: "cliente", texto: "Que horario cierran los sabados?", hora: "Mar" },
      { de: "local", texto: "Sabados 09:00 a 18:00.", hora: "Mar" },
    ] },
    { id: "h9", cliente: "Sergio Villalba", inicial: "SV", canal: "WhatsApp", preview: "El aceite de barba quedo barbaro", hora: "Mar", sinLeer: 0, mensajes: [
      { de: "cliente", texto: "El aceite de barba quedo barbaro", hora: "Mar" },
      { de: "local", texto: "Que bueno Sergio! Cualquier cosa avisanos.", hora: "Mar" },
    ] },
    { id: "h10", cliente: "Cristian Maldonado", inicial: "CM", canal: "WhatsApp", preview: "Reservo el ritual para el finde", hora: "Lun", sinLeer: 0, mensajes: [
      { de: "cliente", texto: "Reservo el ritual para el finde", hora: "Lun" },
      { de: "local", texto: "Perfecto, sabado 10:00 con Emiliano.", hora: "Lun" },
    ] },
    { id: "h11", cliente: "Pablo Zarate", inicial: "PZ", canal: "Instagram", preview: "Hacen diseno con maquina?", hora: "Lun", sinLeer: 1, mensajes: [
      { de: "cliente", texto: "Hacen diseno con maquina?", hora: "Lun" },
    ] },
    { id: "h12", cliente: "Julian Escobar", inicial: "JE", canal: "WhatsApp", preview: "Perfecto, ahi confirmo", hora: "Lun", sinLeer: 0, mensajes: [
      { de: "local", texto: "Julian, tu turno es hoy 09:30.", hora: "Lun" },
      { de: "cliente", texto: "Perfecto, ahi confirmo", hora: "Lun" },
    ] },
    { id: "h13", cliente: "Nahuel Ojeda", inicial: "NO", canal: "WhatsApp", preview: "Disculpen, no voy a poder llegar", hora: "Dom", sinLeer: 0, mensajes: [
      { de: "cliente", texto: "Disculpen, no voy a poder llegar", hora: "Dom" },
      { de: "local", texto: "Sin problema Nahuel, reprogramamos.", hora: "Dom" },
    ] },
    { id: "h14", cliente: "Agustin Ferrari", inicial: "AF", canal: "Instagram", preview: "Buenisimo, gracias por la atencion", hora: "Dom", sinLeer: 0, mensajes: [
      { de: "cliente", texto: "Buenisimo, gracias por la atencion", hora: "Dom" },
    ] },
  ]
}
