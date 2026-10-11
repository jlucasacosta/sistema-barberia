"use client"
// CONVERSACIONES · arquetipo master-detail. Hilos a la izquierda, conversacion
// abierta a la derecha. Burbujas en crema (cliente) / oxblood (local). Color de tokens.
// En celular se ve UNA cosa a la vez: la lista de hilos o el hilo abierto (con boton para volver).
import { useEffect, useState, type FormEvent } from "react"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { AvisoDemo } from "@/shell/ficha-lateral"
import { getHilos, type Hilo } from "./api"

export function ConversacionesPage() {
  const { data, error, cargando, reintentar } = useCarga(getHilos)
  const [hilos, setHilos] = useState<Hilo[]>([])
  const [activo, setActivo] = useState<string | null>(null)
  const [vista, setVista] = useState<"lista" | "hilo">("lista") // solo cambia lo que se ve en celular
  const [borrador, setBorrador] = useState("")
  const [aviso, setAviso] = useState<string | null>(null)

  // Copia local: marcar leido y responder viven en estado de React (F5 los restaura).
  useEffect(() => {
    if (data) {
      setHilos(data)
      setActivo(data[0]?.id ?? null)
    }
  }, [data])

  const hilo = hilos.find((h) => h.id === activo) ?? null
  const listo = !cargando && !error
  const sinLeer = hilos.reduce((a, h) => a + h.sinLeer, 0)

  function abrir(id: string) {
    setActivo(id)
    setVista("hilo")
    setAviso(null)
    setBorrador("")
    setHilos((hs) => hs.map((h) => (h.id === id ? { ...h, sinLeer: 0 } : h)))
  }

  function enviar(e: FormEvent) {
    e.preventDefault()
    const texto = borrador.trim()
    if (!texto || !hilo) return
    const d = new Date()
    const hora = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
    setHilos((hs) =>
      hs.map((h) => (h.id === hilo.id ? { ...h, mensajes: [...h.mensajes, { de: "local", texto, hora }] } : h)),
    )
    setBorrador("")
    setAviso("Mensaje enviado. Demo: no se guardó nada.")
  }

  return (
    <div className="mx-auto max-w-[1300px]">
      <h1 className="font-heading text-4xl tracking-wide text-fg">CONVERSACIONES</h1>
      <p className="mt-1 text-sm text-muted">
        <span className="font-heading text-lg text-accent">{listo ? sinLeer : "—"}</span> sin leer ·{" "}
        {listo ? hilos.length : "—"} hilos
      </p>

      {error ? (
        <div className="mt-5">
          <ErrorCarga mensaje="No pudimos cargar las conversaciones." onReintentar={reintentar} />
        </div>
      ) : (
        <div
          aria-busy={cargando}
          className="mt-5 grid h-[calc(100dvh-210px)] min-h-[420px] gap-0 overflow-hidden rounded-xl border border-border md:grid-cols-[320px_1fr]"
        >
          {/* Master: lista de hilos */}
          <div
            role="region"
            aria-label="Lista de conversaciones"
            className={"overflow-y-auto border-border bg-surface md:block md:border-r " + (vista === "hilo" ? "hidden" : "block")}
          >
            {cargando && (
              <div className="space-y-2 p-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Esqueleto key={i} className="h-14" />
                ))}
              </div>
            )}
            {hilos.map((h) => {
              const active = h.id === activo
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => abrir(h.id)}
                  aria-current={active ? "true" : undefined}
                  className={
                    "flex min-h-14 w-full items-center gap-3 border-b border-border/70 px-3 py-2.5 text-left transition-colors " +
                    (active ? "bg-accent/10" : "hover:bg-subtle/50")
                  }
                >
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg tracking-wide text-surface">
                    {h.inicial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-fg">{h.cliente}</span>
                      <span className="shrink-0 text-xs text-muted">{h.hora}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-muted">{h.preview}</span>
                      {h.sinLeer > 0 && (
                        <span className="chip shrink-0 bg-accent text-surface">
                          {h.sinLeer}
                          <span className="sr-only"> sin leer</span>
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail: conversacion abierta */}
          <div className={"min-h-0 flex-col bg-bg md:flex " + (vista === "lista" ? "hidden" : "flex")}>
            {hilo ? (
              <>
                <div className="flex items-center gap-3 border-b-2 border-laton/50 bg-surface px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setVista("lista")}
                    className="tap -ml-2 flex items-center px-2 font-heading text-lg tracking-wide text-muted hover:text-fg md:hidden"
                  >
                    ‹ HILOS
                  </button>
                  <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl tracking-wide text-surface">
                    {hilo.inicial}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-heading text-xl tracking-wide text-fg">{hilo.cliente}</h2>
                    <div className="text-xs text-muted">{hilo.canal}</div>
                  </div>
                </div>
                <div role="log" aria-label={`Conversación con ${hilo.cliente}`} tabIndex={0} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {hilo.mensajes.map((m, i) => {
                    const local = m.de === "local"
                    return (
                      <div key={i} className={"flex " + (local ? "justify-end" : "justify-start")}>
                        <div
                          className={
                            "max-w-[85%] rounded-lg px-3 py-2 text-sm md:max-w-[75%] " +
                            (local ? "bg-accent text-surface" : "border border-border bg-surface text-fg")
                          }
                        >
                          <p>{m.texto}</p>
                          <span className={"mt-1 block text-xs " + (local ? "text-surface/80" : "text-muted")}>{m.hora}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <form onSubmit={enviar} className="border-t border-border bg-surface px-4 py-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="respuesta" className="sr-only">Respuesta para {hilo.cliente}</label>
                    <input
                      id="respuesta"
                      value={borrador}
                      onChange={(e) => setBorrador(e.target.value)}
                      placeholder="Escribí una respuesta…"
                      autoComplete="off"
                      className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-fg placeholder:text-muted"
                    />
                    <button
                      type="submit"
                      disabled={!borrador.trim()}
                      className="tap rounded-[var(--radius)] bg-primary px-4 font-heading text-lg tracking-wide text-bg disabled:opacity-50"
                    >
                      ENVIAR
                    </button>
                  </div>
                  <AvisoDemo texto={aviso} />
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center px-4 text-center font-heading tracking-widest text-muted">
                {cargando ? "—" : "ELEGÍ UNA CONVERSACIÓN"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
