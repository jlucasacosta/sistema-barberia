// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// La agenda no es una lista: es una GRILLA por barbero. Cada turno tiene barbero,
// hora de inicio, servicio (define alto y color) y estado. En el backend real el
// barbero sale de `barberos`, el turno de `turnos` y el servicio del join con `servicios`.
import { theme } from "@/shell/theme"
import type { EstadoTurno } from "@/shell/agenda"

export type Barbero = {
  id: string
  nombre: string
  inicial: string // dos letras para el avatar (sin foto: sin derechos de imagen)
  especialidad: string
}

export type Turno = {
  id: string
  barberoId: string
  inicio: string // "HH:MM", alineado a franjas de 30 min
  servicio: keyof typeof theme.servicios
  cliente: string
  estado: EstadoTurno
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getBarberos(): Promise<Barbero[]> {
  await sleep(220)
  return [
    { id: "b1", nombre: "Tobias Arrieta", inicial: "TA", especialidad: "Fades y disenos" },
    { id: "b2", nombre: "Ramiro Vega", inicial: "RV", especialidad: "Barba y navaja" },
    { id: "b3", nombre: "Nicolas Baez", inicial: "NB", especialidad: "Corte clasico" },
    { id: "b4", nombre: "Emiliano Sarli", inicial: "ES", especialidad: "Ritual completo" },
  ]
}

// ~22 turnos repartidos entre 4 barberos y las franjas del dia (09:00-20:00).
// Estados mezclados: pendiente, confirmado, cancelado, no-vino.
export async function getTurnos(): Promise<Turno[]> {
  await sleep(300)
  return [
    // Tobias
    { id: "t01", barberoId: "b1", inicio: "09:00", servicio: "fade", cliente: "Lautaro Micheloud", estado: "confirmado" },
    { id: "t02", barberoId: "b1", inicio: "10:00", servicio: "corte", cliente: "Ivan Peralta", estado: "confirmado" },
    { id: "t03", barberoId: "b1", inicio: "11:00", servicio: "combo", cliente: "Gaston Rivero", estado: "pendiente" },
    { id: "t04", barberoId: "b1", inicio: "12:30", servicio: "fade", cliente: "Dario Quinteros", estado: "no-vino" },
    { id: "t05", barberoId: "b1", inicio: "15:00", servicio: "combo", cliente: "Marco Aramburu", estado: "confirmado" },
    { id: "t06", barberoId: "b1", inicio: "17:00", servicio: "fade", cliente: "Bruno Ferre", estado: "pendiente" },
    // Ramiro
    { id: "t07", barberoId: "b2", inicio: "09:30", servicio: "barba", cliente: "Julian Escobar", estado: "confirmado" },
    { id: "t08", barberoId: "b2", inicio: "10:30", servicio: "perfilado", cliente: "Sergio Villalba", estado: "confirmado" },
    { id: "t09", barberoId: "b2", inicio: "11:30", servicio: "combo", cliente: "Nahuel Ojeda", estado: "cancelado" },
    { id: "t10", barberoId: "b2", inicio: "14:00", servicio: "ritual", cliente: "Facundo Leiva", estado: "confirmado" },
    { id: "t11", barberoId: "b2", inicio: "16:30", servicio: "barba", cliente: "Ezequiel Sosa", estado: "pendiente" },
    { id: "t12", barberoId: "b2", inicio: "18:00", servicio: "combo", cliente: "Damian Roldan", estado: "pendiente" },
    // Nicolas
    { id: "t13", barberoId: "b3", inicio: "09:00", servicio: "corte", cliente: "Alejo Barrios", estado: "confirmado" },
    { id: "t14", barberoId: "b3", inicio: "10:00", servicio: "corte", cliente: "Tomas Aguirre", estado: "confirmado" },
    { id: "t15", barberoId: "b3", inicio: "11:00", servicio: "corte", cliente: "Rodrigo Cabral", estado: "pendiente" },
    { id: "t16", barberoId: "b3", inicio: "13:00", servicio: "corte", cliente: "Matias Ferreyra", estado: "no-vino" },
    { id: "t17", barberoId: "b3", inicio: "15:30", servicio: "combo", cliente: "Lucas Ibarra", estado: "confirmado" },
    { id: "t18", barberoId: "b3", inicio: "17:30", servicio: "corte", cliente: "Federico Nunez", estado: "pendiente" },
    // Emiliano
    { id: "t19", barberoId: "b4", inicio: "10:00", servicio: "ritual", cliente: "Cristian Maldonado", estado: "confirmado" },
    { id: "t20", barberoId: "b4", inicio: "12:00", servicio: "combo", cliente: "Pablo Zarate", estado: "confirmado" },
    { id: "t21", barberoId: "b4", inicio: "14:30", servicio: "barba", cliente: "Andres Godoy", estado: "pendiente" },
    { id: "t22", barberoId: "b4", inicio: "16:00", servicio: "ritual", cliente: "Hernan Ledesma", estado: "pendiente" },
  ]
}
