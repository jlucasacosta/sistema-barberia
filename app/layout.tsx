import "./globals.css"
import type { ReactNode, CSSProperties } from "react"
import { theme } from "@/shell/theme"
import { Sidebar } from "@/shell/sidebar"

// Traduce el theme (declarativo) a variables CSS que Tailwind consume.
// Los colores viajan como triplete "R G B" para que Tailwind pueda aplicarles
// opacidad (bg-success/15) sin que ningun componente escriba un color a mano.
const radiusMap = { sharp: "6px", soft: "10px", round: "14px" }
const densityMap = { compact: "12px", comfortable: "20px" }

// En claro la sombra levanta (tinte slate). En oscuro hunde (negro puro).
const shadowMap = {
  light: {
    sm: "0 1px 2px rgb(15 23 42 / 0.04), 0 1px 3px rgb(15 23 42 / 0.06)",
    card: "0 1px 3px rgb(15 23 42 / 0.06), 0 6px 16px rgb(15 23 42 / 0.05)",
    pop: "0 6px 16px rgb(15 23 42 / 0.08), 0 16px 32px rgb(15 23 42 / 0.10)",
  },
  dark: {
    sm: "0 1px 2px rgb(0 0 0 / 0.4)",
    card: "0 1px 3px rgb(0 0 0 / 0.45), 0 8px 24px rgb(0 0 0 / 0.35)",
    pop: "0 2px 6px rgb(0 0 0 / 0.5), 0 18px 40px rgb(0 0 0 / 0.45)",
  },
}

function rgb(hex: string) {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((ch) => ch + ch).join("") : h
  const n = parseInt(full, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

export const metadata = { title: "Sistema", description: "Demo" }

export default function RootLayout({ children }: { children: ReactNode }) {
  const c = theme.colors
  const s = shadowMap[theme.mode]
  const vars = {
    "--primary": rgb(c.primary),
    "--accent": rgb(c.accent),
    "--bg": rgb(c.bg),
    "--surface": rgb(c.surface),
    "--fg": rgb(c.fg),
    "--muted": rgb(c.muted),
    "--border": rgb(c.border),
    "--subtle": rgb(c.subtle),
    "--success": rgb(c.success),
    "--warning": rgb(c.warning),
    "--danger": rgb(c.danger),
    "--info": rgb(c.info),
    "--radius": radiusMap[theme.radius],
    "--pad": densityMap[theme.density],
    "--shadow-sm": s.sm,
    "--shadow-card": s.card,
    "--shadow-pop": s.pop,
    "--font-heading": theme.font.heading + ", system-ui, sans-serif",
    "--font-body": theme.font.body + ", system-ui, sans-serif",
  } as CSSProperties

  return (
    <html lang="es">
      <body style={vars}>
        <div className="flex min-h-screen bg-bg text-fg">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden p-[var(--pad)]">{children}</main>
        </div>
      </body>
    </html>
  )
}
