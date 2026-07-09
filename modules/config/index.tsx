import { theme } from "@/shell/theme"

function Row({ label, value, swatch }: { label: string; value: string; swatch?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex items-center gap-2 text-sm font-medium">
        {swatch && <span className="h-4 w-4 rounded-full border border-border" style={{ background: value }} />}
        {value}
      </span>
    </div>
  )
}

export function ConfigPage() {
  const c = theme.colors
  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Configuracion</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl bg-surface p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold">Marca</h2>
          <Row label="Nombre" value={theme.brand.name} />
          <Row label="Tipografia" value={theme.font.heading} />
          <Row label="Bordes" value={theme.radius} />
          <Row label="Densidad" value={theme.density} />
        </div>

        <div className="space-y-4 rounded-xl bg-surface p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold">Paleta</h2>
          <Row label="Primario" value={c.primary} swatch />
          <Row label="Acento" value={c.accent} swatch />
          <Row label="Exito" value={c.success} swatch />
          <Row label="Alerta" value={c.warning} swatch />
          <Row label="Error" value={c.danger} swatch />
          <Row label="Info" value={c.info} swatch />
        </div>
      </div>

      <div className="rounded-xl bg-surface p-6 shadow-card">
        <h2 className="mb-4 font-heading text-base font-semibold">Estados</h2>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">exito</span>
          <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-xs text-warning">alerta</span>
          <span className="rounded-full bg-danger/15 px-2.5 py-0.5 text-xs text-danger">error</span>
          <span className="rounded-full bg-info/15 px-2.5 py-0.5 text-xs text-info">info</span>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs text-primary">primario</span>
          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent">acento</span>
        </div>
        <p className="pt-4 text-xs text-muted">
          Todo esto sale de shell/theme.ts. Cambias un archivo y muta el sistema entero.
        </p>
      </div>
    </div>
  )
}
