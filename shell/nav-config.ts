// nav-config.ts · Las secciones del sistema. SIN-ICONOS (ficha §6): la estetica de
// cartel esmaltado se apoya en tipografia (Bebas) y numerales, no en glifos.
export type NavItem = { label: string; href: string }

export const nav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "La Silla", href: "/agenda" },
  { label: "Conversaciones", href: "/conversaciones" },
  { label: "Ventas", href: "/ventas" },
  { label: "Contactos", href: "/contactos" },
  { label: "Config", href: "/config" },
]
