import { LayoutDashboard, MessageSquare, CalendarClock, Banknote, Users, Settings, type LucideIcon } from "lucide-react"

export type NavItem = { label: string; href: string; icon: LucideIcon }

export const nav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Turnos", href: "/agenda", icon: CalendarClock },
  { label: "Conversaciones", href: "/conversaciones", icon: MessageSquare },
  { label: "Ventas", href: "/ventas", icon: Banknote },
  { label: "Contactos", href: "/contactos", icon: Users },
  { label: "Configuracion", href: "/config", icon: Settings },
]
