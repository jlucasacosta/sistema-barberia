// theme.ts · Navaja Barbershop (sistema barberia)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Modo CLARO: barberia de barrio, luz de manana.
// Color de nicho: grafito (navaja) + dorado laton (detalle premium). Sin rojo.

export type Theme = {
  brand: { name: string; logo?: string }
  mode: "light" | "dark"
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
    subtle: string
    // Semanticos: estados, badges, metricas. LOS CUATRO, SIEMPRE.
    success: string
    warning: string
    danger: string
    info: string
  }
  font: { heading: string; body: string }
  radius: "sharp" | "soft" | "round"
  density: "comfortable" | "compact"
}

export const navaja: Theme = {
  brand: { name: "Navaja Barbershop" },
  mode: "light",
  colors: {
    primary: "#1c1a17",
    accent: "#c9962d",
    bg: "#f5f3ef",
    surface: "#ffffff",
    fg: "#1c1a17",
    muted: "#7a736a",
    border: "#e7e2da",
    subtle: "#efeae2",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626",
    info: "#0284c7",
  },
  font: { heading: "Inter", body: "Inter" },
  radius: "sharp",
  density: "comfortable",
}

export const theme: Theme = navaja
