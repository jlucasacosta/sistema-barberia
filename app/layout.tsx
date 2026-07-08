import "./globals.css"
import type { ReactNode, CSSProperties } from "react"
import { theme } from "@/shell/theme"
import { Sidebar } from "@/shell/sidebar"

// Traduce el theme (declarativo) a variables CSS que Tailwind consume.
const radiusMap = { sharp: "6px", soft: "10px", round: "14px" }
const densityMap = { compact: "12px", comfortable: "20px" }

export const metadata = { title: "Sistema", description: "Demo" }

export default function RootLayout({ children }: { children: ReactNode }) {
  const c = theme.colors
  const vars = {
    "--primary": c.primary,
    "--accent": c.accent,
    "--bg": c.bg,
    "--surface": c.surface,
    "--fg": c.fg,
    "--muted": c.muted,
    "--border": c.border,
    "--subtle": c.subtle,
    "--radius": radiusMap[theme.radius],
    "--pad": densityMap[theme.density],
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
