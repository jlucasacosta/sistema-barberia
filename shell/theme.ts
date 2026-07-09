// theme.ts · Navaja Barbershop (sistema barberia)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Ficha de Diseño: ver DISENO.md. Cliche rechazado (entero): el poste giratorio
// rojo-blanco-azul, el sepia vintage, el bigote+tijera. Esto es el libro de citas
// de cuero de una barberia-atelier sobre marmol: papel hueso, tinta casi negra,
// oxblood como acento y un solo metal calido (laton) de filete.

export type Theme = {
  brand: { name: string; logo?: string }
  mode: "light" | "dark"
  nav: "sidebar" | "topbar" | "rail"
  elevation: "raised" | "outlined" | "flat"
  badge: "pill" | "square"
  radius: "sharp" | "soft" | "round"
  density: "compact" | "comfortable"
  font: { heading: string; body: string }
  colors: {
    primary: string
    accent: string
    laton: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
    subtle: string
    success: string
    warning: string
    danger: string
    info: string
  }
  // Constantes de dominio de la barberia. Son DISEÑO, no logica suelta:
  // ningun componente inventa un numero magico. El helper shell/agenda.ts
  // los traduce a posicion/alto de bloque y a clases literales.
  agenda: {
    apertura: string // "HH:MM" primera franja del dia
    cierre: string // "HH:MM" ultima franja
    franjaMin: number // duracion de cada franja
    franjaPx: number // alto en px de una franja (grabar en 9:16)
  }
  // Catalogo de servicios: duracion (define el ALTO del bloque), precio y
  // familia de tinte (define el COLOR del bloque). Cambiar aca cambia toda la grilla.
  servicios: Record<
    string,
    { label: string; dur: number; precio: number; tinte: "corte" | "barba" | "combo" }
  >
  moneda: string
}

export const navaja: Theme = {
  brand: { name: "Navaja Barbershop" },
  mode: "light",
  nav: "topbar",
  elevation: "flat",
  badge: "square",
  radius: "soft",
  density: "comfortable",
  font: { heading: "Bebas Neue", body: "DM Sans" },
  colors: {
    primary: "#17130F", // tinta / filo: negro casi puro
    accent: "#7A2E2E", // oxblood / borgoña: el acento
    laton: "#B5893F", // laton: UNICO metal, solo filete (bordes, subrayados, linea ahora)
    bg: "#F4EEE3", // crema papel de barberia
    surface: "#FCFAF4", // marfil de la lamina / tarjeta
    fg: "#17130F", // tinta
    muted: "#8A7B68", // sepia apagado para texto secundario
    border: "#E0D6C4", // tan suave
    subtle: "#ECE4D5", // hover / relleno de franja
    success: "#4E7A54", // verde desaturado = confirmado
    warning: "#C9761F", // ambar frio = pendiente (separado del laton a proposito)
    danger: "#B23A2E", // ladrillo = cancelado / rechazado
    info: "#5B6B72", // acero desaturado = tinte del servicio "corte"
  },
  agenda: {
    apertura: "09:00",
    cierre: "20:00",
    franjaMin: 30,
    franjaPx: 58,
  },
  servicios: {
    corte: { label: "Corte clasico", dur: 30, precio: 450, tinte: "corte" },
    fade: { label: "Fade", dur: 30, precio: 550, tinte: "corte" },
    barba: { label: "Barba", dur: 30, precio: 350, tinte: "barba" },
    perfilado: { label: "Perfilado", dur: 30, precio: 300, tinte: "barba" },
    combo: { label: "Corte + barba", dur: 60, precio: 750, tinte: "combo" },
    ritual: { label: "Ritual completo", dur: 90, precio: 1100, tinte: "combo" },
  },
  moneda: "$",
}

export const theme: Theme = navaja
