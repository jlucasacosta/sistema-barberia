"use client"
// CONFIG · arquetipo acordeon. Secciones colapsables, UNA abierta a la vez.
// Cabeceras en Bebas con filete de laton. Servicios/precios y horarios salen del
// theme: cambiar theme.ts cambia esta pantalla. Local y notificaciones salen de
// modules/config/data.json (api.ts) y los barberos de agenda. Color de tokens.
import { useEffect, useState } from "react"
import { theme } from "@/shell/theme"
import { precio } from "@/shell/agenda"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { getBarberos } from "@/modules/agenda/api"
import { getLocal, getNotificaciones, type Notificacion } from "./api"

const cargarConfig = () => Promise.all([getLocal(), getNotificaciones(), getBarberos()])

const secciones = ["local", "barberos", "servicios", "horarios", "notificaciones"]
const titulos: Record<string, string> = {
  local: "El local",
  barberos: "Barberos",
  servicios: "Servicios y precios",
  horarios: "Horarios",
  notificaciones: "Notificaciones",
}

export function ConfigPage() {
  const { data, error, cargando, reintentar } = useCarga(cargarConfig)
  const [abierta, setAbierta] = useState<string>("servicios")
  const [notifs, setNotifs] = useState<Notificacion[]>([])

  // Copia local: los interruptores viven en estado de React (F5 los restaura).
  useEffect(() => {
    if (data) setNotifs(data[1])
  }, [data])

  return (
    <div className="mx-auto max-w-[820px]">
      <h1 className="font-heading text-4xl tracking-wide text-fg">CONFIGURACIÓN</h1>
      <p className="mt-1 text-sm text-muted">{theme.brand.name} · panel del local</p>

      {error ? (
        <div className="mt-5">
          <ErrorCarga mensaje="No pudimos cargar la configuración." onReintentar={reintentar} />
        </div>
      ) : (
        <div aria-busy={cargando} className="mt-5 space-y-2.5">
          {secciones.map((s) => {
            const open = abierta === s
            return (
              <div key={s} className="overflow-hidden rounded-xl border border-border bg-surface">
                <h2>
                  <button
                    type="button"
                    id={`acc-${s}`}
                    aria-expanded={open}
                    aria-controls={`panel-${s}`}
                    onClick={() => setAbierta(open ? "" : s)}
                    className={"flex min-h-11 w-full items-center justify-between px-4 py-3 text-left " + (open ? "filete" : "")}
                  >
                    <span className="font-heading text-2xl tracking-wide text-fg">{titulos[s]}</span>
                    <span aria-hidden="true" className="font-heading text-2xl text-laton-ink">{open ? "–" : "+"}</span>
                  </button>
                </h2>
                {open && (
                  <div id={`panel-${s}`} role="region" aria-labelledby={`acc-${s}`} className="px-4 py-4">
                    {cargando && s !== "servicios" && s !== "horarios" ? (
                      <div className="space-y-2">
                        <Esqueleto className="h-12" />
                        <Esqueleto className="h-12" />
                      </div>
                    ) : (
                      contenido(s, data, notifs, setNotifs)
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function contenido(
  s: string,
  data: Awaited<ReturnType<typeof cargarConfig>> | null,
  notifs: Notificacion[],
  setNotifs: (fn: (n: Notificacion[]) => Notificacion[]) => void,
) {
  const local = data?.[0]
  const barberos = data?.[2] ?? []
  if (s === "local") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo label="Nombre" valor={theme.brand.name} />
        <Campo label="Dirección" valor={local?.direccion ?? "—"} />
        <Campo label="Teléfono" valor={local?.telefono ?? "—"} />
        <Campo label="Instagram" valor={local?.instagram ?? "—"} />
      </div>
    )
  }
  if (s === "barberos") {
    return (
      <ul className="divide-y divide-border/70">
        {barberos.map((b) => (
          <li key={b.id} className="flex items-center gap-3 py-2.5">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-lg tracking-wide text-surface ring-1 ring-laton">
              {b.inicial}
            </span>
            <div>
              <div className="font-medium text-fg">{b.nombre}</div>
              <div className="text-xs text-muted">{b.especialidad}</div>
            </div>
          </li>
        ))}
      </ul>
    )
  }
  if (s === "servicios") {
    return (
      <ul className="divide-y divide-border/70">
        {Object.values(theme.servicios).map((sv) => (
          <li key={sv.label} className="flex items-center justify-between py-2.5">
            <div>
              <div className="font-medium text-fg">{sv.label}</div>
              <div className="text-xs text-muted">{sv.dur} min</div>
            </div>
            <span className="font-heading text-2xl tracking-wide text-accent">{precio(sv.precio)}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (s === "horarios") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo label="Apertura" valor={theme.agenda.apertura} />
        <Campo label="Cierre" valor={theme.agenda.cierre} />
        <Campo label="Duración de franja" valor={`${theme.agenda.franjaMin} min`} />
        <Campo label="Días" valor={local?.dias ?? "—"} />
      </div>
    )
  }
  return (
    <ul className="divide-y divide-border/70">
      {notifs.map((n) => (
        <li key={n.id} className="flex items-center justify-between gap-3 py-2.5">
          <span id={`notif-${n.id}`} className="text-fg">{n.label}</span>
          {/* Interruptor: cambia el estado local, no guarda nada (demo). */}
          <button
            type="button"
            role="switch"
            aria-checked={n.activo}
            aria-labelledby={`notif-${n.id}`}
            onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, activo: !x.activo } : x)))}
            className={
              "chip chip-btn shrink-0 " +
              (n.activo
                ? "border border-success/45 bg-success/12 text-success-ink"
                : "border border-border bg-subtle/60 text-muted")
            }
          >
            {n.activo ? "Activo" : "Apagado"}
          </button>
        </li>
      ))}
    </ul>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 text-fg">{valor}</div>
    </div>
  )
}
