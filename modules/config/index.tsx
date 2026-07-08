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
  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Configuracion</h1>
      <div className="max-w-md space-y-4 rounded-xl bg-surface p-6 shadow-card">
        <Row label="Marca" value={theme.brand.name} />
        <Row label="Color primario" value={theme.colors.primary} swatch />
        <Row label="Color acento" value={theme.colors.accent} swatch />
        <Row label="Tipografia" value={theme.font.heading} />
        <Row label="Bordes" value={theme.radius} />
        <Row label="Densidad" value={theme.density} />
        <p className="pt-2 text-xs text-muted">
          Todo esto sale de shell/theme.ts. Cambias un archivo y muta el sistema entero.
        </p>
      </div>
    </div>
  )
}
