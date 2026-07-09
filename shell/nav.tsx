"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { nav } from "./nav-config"
import { theme } from "./theme"

// Chasis segun theme.nav. En Navaja es SIEMPRE topbar (cartel del local) y SIN-ICONOS:
// el rotulo en Bebas hace todo el trabajo. Ver DISENO.md §5-6.

function Marca() {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-heading text-2xl tracking-[0.14em] text-fg">NAVAJA</span>
      <span className="hidden font-heading text-2xl tracking-[0.14em] text-accent sm:inline">BARBERSHOP</span>
    </span>
  )
}

// --- topbar: barra superior tipo cartel de local. Solo label, sin glifos. ---
function Topbar({ path }: { path: string }) {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-laton/60 bg-surface">
      <div className="flex items-center gap-8 px-[var(--pad)] py-3">
        <Marca />
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {nav.map(({ label, href }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                className={
                  "shrink-0 border-b-2 px-3 py-1.5 font-heading text-lg tracking-[0.08em] uppercase transition-colors " +
                  (active
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:border-laton/50 hover:text-fg")
                }
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export function Nav() {
  const path = usePathname()
  // Navaja solo usa topbar; el switch queda por si el theme cambia de nav.
  if (theme.nav === "topbar") return <Topbar path={path} />
  return <Topbar path={path} />
}
