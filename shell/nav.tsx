"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
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

// Usuario de la demo: iniciales + "Cuenta demo". Es el pie del menu (en la tira superior va a la derecha).
export function UsuarioDemo({ className = "" }: { className?: string }) {
  return (
    <span className={"flex items-center gap-2 " + className}>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm tracking-wide text-surface ring-1 ring-laton"
      >
        DM
      </span>
      <span className="text-xs leading-tight text-muted">
        <span className="block text-fg">Cuenta demo</span>
        {theme.brand.name}
      </span>
    </span>
  )
}

// --- topbar: barra superior tipo cartel de local. Solo label, sin glifos. ---
function Topbar({ path }: { path: string }) {
  const tira = useRef<HTMLElement>(null)
  // Pista de scroll: hay mas secciones a la izquierda / derecha de lo que se ve.
  const [mas, setMas] = useState({ izq: false, der: false })

  const medir = useCallback(() => {
    const el = tira.current
    if (!el) return
    setMas({
      izq: el.scrollLeft > 4,
      der: el.scrollWidth - el.scrollLeft - el.clientWidth > 4,
    })
  }, [])

  useEffect(() => {
    medir()
    window.addEventListener("resize", medir)
    return () => window.removeEventListener("resize", medir)
  }, [medir])

  // La seccion activa se centra a la vista al cargar y al navegar.
  useEffect(() => {
    tira.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" })
    medir()
  }, [path, medir])

  const degrade = "linear-gradient(to right, transparent 0, #000 1.5rem, #000 calc(100% - 1.5rem), transparent 100%)"
  const mascara: CSSProperties = {
    maskImage: mas.izq && mas.der ? degrade
      : mas.der ? "linear-gradient(to right, #000 calc(100% - 2rem), transparent 100%)"
      : mas.izq ? "linear-gradient(to right, transparent 0, #000 2rem)"
      : undefined,
  }
  mascara.WebkitMaskImage = mascara.maskImage

  return (
    <header className="sticky top-0 z-20 border-b-2 border-laton/60 bg-surface">
      <div className="flex items-center gap-4 px-[var(--pad)] py-2 sm:gap-8">
        <Marca />
        <nav
          ref={tira}
          aria-label="Secciones"
          onScroll={medir}
          style={mascara}
          className="sin-barra flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        >
          {nav.map(({ label, href }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-11 shrink-0 items-center border-b-2 px-3 font-heading text-lg tracking-[0.08em] uppercase transition-colors " +
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
        <UsuarioDemo className="hidden shrink-0 lg:flex" />
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
