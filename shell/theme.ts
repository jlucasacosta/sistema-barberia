// theme.ts · Navaja Barbershop (sistema barberia)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Lenguaje visual: tech / SaaS (elevacion, radio, aire). Marca: near-black + rojo barber.

export type Theme = {
  brand: { name: string; logo?: string }
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
    subtle: string
  }
  font: { heading: string; body: string }
  radius: "sharp" | "soft" | "round"
  density: "comfortable" | "compact"
}

export const navaja: Theme = {
  brand: { name: "Navaja Barbershop" },
  colors: {
    primary: "#1c1a17",
    accent: "#c0392b",
    bg: "#f5f3ef",
    surface: "#ffffff",
    fg: "#1c1a17",
    muted: "#7a736a",
    border: "#e7e2da",
    subtle: "#efeae2",
  },
  font: { heading: "Inter", body: "Inter" },
  radius: "sharp",
  density: "comfortable",
}

export const theme: Theme = navaja
