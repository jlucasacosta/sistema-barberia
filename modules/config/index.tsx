"use client"
// CONFIG · arquetipo acordeon. Secciones colapsables, UNA abierta a la vez.
// Cabeceras en Bebas con filete de laton. Servicios/precios y horarios salen del
// theme: cambiar theme.ts cambia esta pantalla. Color de tokens.
import { useState } from "react"
import { theme } from "@/shell/theme"
import { precio } from "@/shell/agenda"

const barberos = [
  { nombre: "Tobias Arrieta", rol: "Barbero senior · Fades y disenos" },
  { nombre: "Ramiro Vega", rol: "Barbero · Barba y navaja" },
  { nombre: "Nicolas Baez", rol: "Barbero · Corte clasico" },
  { nombre: "Emiliano Sarli", rol: "Barbero senior · Ritual completo" },
]

const notificaciones = [
  { label: "Recordatorio de turno por WhatsApp", on: true },
  { label: "Aviso de silla libre para walk-ins", on: true },
  { label: "Encuesta post-servicio", on: false },
  { label: "Promo de cumpleanos del cliente", on: true },
]

export function ConfigPage() {
  const [abierta, setAbierta] = useState<string>("servicios")
  const secciones = ["local", "barberos", "servicios", "horarios", "notificaciones"]
  const titulos: Record<string, string> = {
    local: "El local",
    barberos: "Barberos",
    servicios: "Servicios y precios",
    horarios: "Horarios",
    notificaciones: "Notificaciones",
  }

  return (
    <div className="mx-auto max-w-[820px]">
      <h1 className="font-heading text-4xl tracking-wide text-fg">CONFIGURACION</h1>
      <p className="mt-1 text-sm text-muted">{theme.brand.name} · panel del local</p>

      <div className="mt-5 space-y-2.5">
        {secciones.map((s) => {
          const open = abierta === s
          return (
            <div key={s} className="overflow-hidden rounded-xl border border-border bg-surface">
              <button
                onClick={() => setAbierta(open ? "" : s)}
                className={"flex w-full items-center justify-between px-4 py-3 text-left " + (open ? "filete" : "")}
              >
                <span className="font-heading text-2xl tracking-wide text-fg">{titulos[s]}</span>
                <span className="font-heading text-2xl text-laton">{open ? "–" : "+"}</span>
              </button>
              {open && <div className="px-4 py-4">{contenido(s)}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function contenido(s: string) {
  if (s === "local") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo label="Nombre" valor={theme.brand.name} />
        <Campo label="Direccion" valor="Pasaje del Filo 458, Rosario" />
        <Campo label="Telefono" valor="+54 9 341 555 0198" />
        <Campo label="Instagram" valor="@navaja.barbershop" />
      </div>
    )
  }
  if (s === "barberos") {
    return (
      <ul className="divide-y divide-border/70">
        {barberos.map((b) => (
          <li key={b.nombre} className="flex items-center gap-3 py-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-lg tracking-wide text-surface ring-1 ring-laton">
              {b.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <div>
              <div className="font-medium text-fg">{b.nombre}</div>
              <div className="text-xs text-muted">{b.rol}</div>
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
        <Campo label="Duracion de franja" valor={`${theme.agenda.franjaMin} min`} />
        <Campo label="Dias" valor="Lunes a sabado" />
      </div>
    )
  }
  return (
    <ul className="divide-y divide-border/70">
      {notificaciones.map((n) => (
        <li key={n.label} className="flex items-center justify-between py-2.5">
          <span className="text-fg">{n.label}</span>
          <span className={"chip " + (n.on ? "border border-success/45 bg-success/12 text-success" : "border border-border bg-subtle/60 text-muted")}>
            {n.on ? "Activo" : "Off"}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 text-fg">{valor}</div>
    </div>
  )
}
