// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Inbox master-detail: hilos a la izquierda, conversacion a la derecha.
// En el backend real los hilos salen de `conversaciones` y los mensajes de `mensajes`.
import raw from "./data.json"

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
  return structuredClone(raw.hilos) as Hilo[]
}
