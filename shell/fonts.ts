// fonts.ts · La voz de Navaja Barbershop.
// Bebas Neue = condensada de marquesina/cartel esmaltado: titulos, rotulos y numerales.
// DM Sans = texto corrido, legible entre corte y corte. Auto-hosteadas por next/font.
import { Bebas_Neue, DM_Sans } from "next/font/google"

export const headingFont = Bebas_Neue({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-heading-src" })
export const bodyFont = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-body-src" })

export const fontClass = `${headingFont.variable} ${bodyFont.variable}`
