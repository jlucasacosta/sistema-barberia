// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Datos del local y preferencias de notificacion. En el backend real salen de las tablas
// `ajustes` (clave/valor) y `notificaciones`. Los barberos NO se repiten aca: Config reutiliza
// `getBarberos()` de agenda, y servicios/horarios salen de `shell/theme.ts`.
import raw from "./data.json"

export type Local = { direccion: string; telefono: string; instagram: string; dias: string }
export type Notificacion = { id: string; label: string; activo: boolean }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getLocal(): Promise<Local> {
  await sleep(180)
  return structuredClone(raw.local) as Local
}

export async function getNotificaciones(): Promise<Notificacion[]> {
  await sleep(200)
  return structuredClone(raw.notificaciones) as Notificacion[]
}
