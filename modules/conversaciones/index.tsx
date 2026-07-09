"use client"
// CONVERSACIONES · arquetipo master-detail. Hilos a la izquierda, conversacion
// abierta a la derecha. Burbujas en crema (cliente) / oxblood (local). Color de tokens.
import { useEffect, useState } from "react"
import { getHilos, type Hilo } from "./api"

export function ConversacionesPage() {
  const [hilos, setHilos] = useState<Hilo[]>([])
  const [activo, setActivo] = useState<string | null>(null)

  useEffect(() => {
    getHilos().then((h) => {
      setHilos(h)
      setActivo(h[0]?.id ?? null)
    })
  }, [])

  const hilo = hilos.find((h) => h.id === activo) ?? null

  return (
    <div className="mx-auto max-w-[1300px]">
      <h1 className="font-heading text-4xl tracking-wide text-fg">CONVERSACIONES</h1>
      <p className="mt-1 text-sm text-muted">
        <span className="font-heading text-lg text-accent">{hilos.reduce((a, h) => a + h.sinLeer, 0)}</span> sin leer ·{" "}
        {hilos.length} hilos
      </p>

      <div className="mt-5 grid gap-0 overflow-hidden rounded-xl border border-border md:grid-cols-[320px_1fr]" style={{ height: "calc(100vh - 210px)" }}>
        {/* Master: lista de hilos */}
        <div className="overflow-y-auto border-b border-border bg-surface md:border-b-0 md:border-r">
          {hilos.map((h) => {
            const active = h.id === activo
            return (
              <button
                key={h.id}
                onClick={() => setActivo(h.id)}
                className={
                  "flex w-full items-center gap-3 border-b border-border/70 px-3 py-2.5 text-left transition-colors " +
                  (active ? "bg-accent/10" : "hover:bg-subtle/50")
                }
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg tracking-wide text-surface">
                  {h.inicial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-fg">{h.cliente}</span>
                    <span className="shrink-0 text-[11px] text-muted">{h.hora}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted">{h.preview}</span>
                    {h.sinLeer > 0 && (
                      <span className="chip shrink-0 bg-accent text-surface">{h.sinLeer}</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail: conversacion abierta */}
        <div className="flex flex-col bg-bg">
          {hilo ? (
            <>
              <div className="flex items-center gap-3 border-b-2 border-laton/50 bg-surface px-4 py-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-heading text-xl tracking-wide text-surface">
                  {hilo.inicial}
                </span>
                <div>
                  <div className="font-heading text-xl tracking-wide text-fg">{hilo.cliente}</div>
                  <div className="text-xs text-muted">{hilo.canal}</div>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {hilo.mensajes.map((m, i) => {
                  const local = m.de === "local"
                  return (
                    <div key={i} className={"flex " + (local ? "justify-end" : "justify-start")}>
                      <div
                        className={
                          "max-w-[75%] rounded-lg px-3 py-2 text-sm " +
                          (local ? "bg-accent text-surface" : "border border-border bg-surface text-fg")
                        }
                      >
                        <p>{m.texto}</p>
                        <span className={"mt-1 block text-[10px] " + (local ? "text-surface/70" : "text-muted")}>{m.hora}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-border bg-surface px-4 py-3">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-muted">
                  Escribi una respuesta&hellip;
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center font-heading tracking-widest text-muted">SIN HILO</div>
          )}
        </div>
      </div>
    </div>
  )
}
