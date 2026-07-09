# Ficha de Diseño — Navaja Barbershop

> Sistema: `sistema-barberia` · Nicho: barbería · Demo frontend Next.js + Tailwind con mock data, pensado para GRABARSE como contenido. El objetivo no es que sea lindo: es que sea RECONOCIBLE y distinto de inmobiliaria y restaurante.

---

## 1. Marca

**Navaja Barbershop** — barbería-atelier de barrio. Ficticia. Todo el sistema respira "libro de citas de cuero sobre mármol", no "app de calendario". El nombre juega con el filo: precisión de barbero, no nostalgia.

---

## 2. Usuario y contexto

- **Quién:** el barbero y el que atiende el mostrador. De pie, con las manos ocupadas (tijera, máquina, gel), mirando el celular entre corte y corte.
- **Apuro:** turnos cada 30-45 min, walk-ins que caen sin avisar, varias sillas en paralelo. Poca lectura, mucho vistazo.
- **La tarea que se repite 40 veces al día:** mirar la grilla del día. Quién sigue, en qué silla, con qué barbero, cuánto falta. No leen: escanean color y posición de columna.
- **Qué se rompe si el dato llega tarde:** doble-booking en la misma silla, o silla vacía con cola afuera. Plata que se va. No-show sin registrar arruina el conteo.
- **De reojo (color/posición/tamaño):** silla ocupada vs libre, barbero asignado, franja en curso (línea "ahora"). **Lee de verdad** sólo al tocar: nombre del cliente y servicio.

---

## 3. LA pantalla que manda: AGENDA

La agenda como **grilla-semana por barbero**: columnas = barberos/sillas, filas = franjas horarias. Bloques de color por servicio, gap visible = hueco vendible para walk-in, línea "ahora" que barre. Ahí vive el negocio. Dashboard y ventas son de reojo al cierre.

---

## 4. Dirección de arte

**Concepto:** "el libro de citas de una barbería-atelier". Papel hueso, tinta casi negra, un solo metal cálido (latón) como filete. Se lee como agenda de cuero, no como software.

**Cliché rechazado (entero):** el poste giratorio rojo-blanco-azul, el sepia vintage, el bigote + tijera cruzada, la madera de hipster. Es disfraz, no oficio. Navaja es precisión de barbero, no souvenir. **Nada de tricolor de poste en ningún componente.**

**Resolución del debate (síntesis):**
- El "poste giratorio de rayas" que proponía el Arquitecto se **descarta**: reintroduce exactamente el cliché que el Director vetó. La estrella se cierra en la **grilla-semana con cabeceras-barbero** (ver §7), que además es el frame-firma que pide el Productor.
- Iconos: se cierra en **sin-iconos** (el resumen del Arquitecto y el Abogado mandan sobre la línea suelta "lucide-fino" del Director). Rótulos en Bebas + numerales grandes hacen el trabajo; coherente con "cartel esmaltado".
- Color: se aplica la corrección del Abogado. El **accent pasa a oxblood/borgoña**, y el **latón queda sólo como filete metálico** (bordes finos, subrayados, líneas de cabecera). Motivo: el latón cae en la familia cálida-ámbar del vecino restaurante y colisiona en hue con el estado "pendiente". Oxblood blinda la diferenciación.
- Estado `pendiente` en **ámbar frío/naranja** (`#C9761F`), separado del latón, para que confirmar (verde) → pendiente (ámbar) → latón no se confundan.

---

## 5. Palancas del theme (PIEL)

| Palanca | Valor | Por qué / diferenciación |
|---|---|---|
| mode | **light** | crema/marfil papel-de-barbería. Ni carbón (restaurante) ni blanco clínico (inmobiliaria). |
| nav | **topbar** | barra superior tipo cartel de local. Ni sidebar (inmob) ni rail (resto). Un solo local, pocas secciones: la nav es un rótulo, no una columna. |
| elevation | **flat** | láminas mate sin sombra, estética litográfica. Los otros son outlined/raised. |
| radius | **soft** | esquinas apenas suavizadas, más carné que ficha o pastilla. |
| density | **comfortable** | la grilla y las sillas respiran; bloques anchos para grabar en 9:16. |
| badge | **square** | etiquetas rectas tipo cartel esmaltado. |
| fuentes | **Bebas_Neue** (display/números) + **DM_Sans** (texto) | condensada de marquesina barbera; nadie más usa Bebas. Se despega de Fraunces (inmob) y Archivo (resto). |
| color | **oxblood/borgoña + tinta negra + crema papel**, latón como único metal de filete | ni verde-tierra (inmob) ni brasa-ámbar (resto). |

**Paleta:** `primary=#17130F` (tinta/filo) · `accent=#7A2E2E` (oxblood) · `latón=#B5893F` (sólo filete metálico) · `crema=#F4EEE3` (fondo papel) · estados: `pendiente=#C9761F` (ámbar frío), `confirmado=#4E7A54` (verde desaturado).

**Chequeo de mismidad:**
- vs inmobiliaria: difieren nav, elevation, radius, density, fuentes, color = **6 palancas**. OK.
- vs restaurante: difieren mode, nav, elevation, radius, badge, fuentes, color = **7 palancas**. OK.

---

## 6. Esqueleto — módulos → arquetipo

| Módulo | Arquetipo | Componentes, tamaños, qué se ve |
|---|---|---|
| **agenda** ⭐ | **grilla-semana** | Columna por barbero/silla × filas de franjas horarias (cada 30 min). Cabecera de columna con **avatar del barbero gigante** + nombre en Bebas. Turno = bloque-tarjeta teñido por servicio (corte / barba / combo), nombre del cliente grande + servicio en mayúscula + ticket de precio visible. Línea "ahora" horizontal que barre. Huecos = tramos crema resaltados con contorno latón = vendibles para walk-in. Nadie más usa grilla-semana. |
| **ventas** | **kanban** | Columnas = estados del día (Esperando → En silla → Cobrado), tarjetas = tickets (corte + producto) que se arrastran a "Cobrado". Muestra el flujo del día, no una lista muerta. Nadie más usa kanban. |
| **contactos** | **tabla-densa** | Ficha de cliente en filas compactas: última visita, barbero fijo, servicio habitual, gasto acumulado. Numerales en Bebas. |
| **conversaciones** | **master-detail** | Lista de hilos a la izquierda (avatar + preview + hora), conversación abierta a la derecha. Burbujas en crema/oxblood. |
| **config** | **acordeón** | Secciones colapsables (local, barberos, servicios+precios, horarios, notificaciones). Cabeceras en Bebas con filete latón; una abierta a la vez. |
| **dashboard** | **board** | Hub de widgets de reojo al cierre: **anillos de ocupación** por barbero, **mini-grilla del día** (versión reducida de La Silla), y **barras-ranking** del top barberos/servicios. Sin gráfico pesado. |

**KPI = anillos** (ocupación % por barbero/silla) · **Gráfico = barras-ranking** (top barberos/servicios del período). Combo anillos+ranking inédito en la colección (inmob = barra-metas+heatmap; resto = ticker+barras-verticales).

**Iconos = sin-iconos.** Rótulos en Bebas y numerales grandes cargan la jerarquía. El vecino restaurante va lucide-grueso; acá la estética de cartel se apoya en tipografía, no en glifos.

**Estructura de página = título-con-filtros.** Chips de barbero arriba de cada pantalla filtran todo (agenda, ventas, contactos). Reemplazan al buscador.

---

## 7. Componente estrella — "La Silla" (grilla-semana multi-barbero)

La espina del sistema. Vive a pantalla completa en **agenda** y en versión reducida en **dashboard**.

**Layout:**
- Grid CSS: N columnas (una por barbero/silla, típ. 3-4) × M filas (franjas de 30 min desde apertura a cierre).
- **Cabecera de columna (sticky):** avatar circular grande del barbero (identidad humana — ningún otro sistema encabeza columnas con una persona), nombre en Bebas mayúscula, dot de estado (en silla / libre) y contador "silla libre en NNmin" que baja en vivo.
- **Bloque-turno:** tarjeta `flat` + `radius soft`, alto proporcional a la duración del servicio, ancho = toda la columna. Contiene: hora, nombre del cliente (grande), servicio en MAYÚSCULA, ticket de precio (`$` en Bebas). Color de fondo = tinte del servicio, todo desde `theme.ts`:
  - `corte` = tinta/acero, `barba` = oxblood, `combo` = oxblood profundo + filete latón.
- **Estado del turno (chip square):** `pendiente` = ámbar frío `#C9761F`; `confirmado` = verde `#4E7A54`. El chip se separa del latón a propósito.
- **Huecos vendibles:** cualquier celda sin turno se pinta crema con contorno punteado latón y label "LIBRE" — se lee como oportunidad, no como vacío.
- **Línea "ahora":** banda horizontal fina (2-3px, latón brillante) posicionada por la hora actual (`top` calculado). Cruza todas las columnas. El bloque que la contiene lleva un realce sutil de borde.
- **Interacción grabable:** un turno se **arrastra** a otra silla/hora; al soltarlo cambia de columna y su chip pasa de `pendiente` (ámbar) → `confirmado` (verde). Segundo beat: el contador "silla libre en 15min" bajando en vivo.

**Reglas duras:** todo el color sale de `theme.ts`. Cero tricolor de poste. Sin sombras (flat). Numerales en Bebas.

---

## 8. Componente eliminado

**La barra de búsqueda global/dominante.** Un local único, pocos barberos y clientes recurrentes se navega por **chips de barbero** y por la propia grilla, no buscando en una base. El buscador ocupa lugar sin aportar y contradice la lógica de "el día se corre de un vistazo". Se elimina; los chips de barbero de la estructura título-con-filtros lo reemplazan.

---

## 9. Frame-firma (lo que lo delata en 1 segundo)

Grilla-semana con **barberos-avatar arriba de cada columna** y un turno que **salta de silla volviéndose verde al confirmarse**. Inmobiliaria manda con un mapa de pins; restaurante con un riel de tickets que se calienta; Navaja manda con una semana-calendario llena de bloques por servicio y cabeceras con cara de barbero. Ningún otro sistema tiene columnas encabezadas por una persona.

---

## 10. Veredicto

**PASA.** Piel diferenciada de ambos vecinos en 6-7 palancas. Esqueleto con dos arquetipos que nadie usa (agenda=grilla-semana, ventas=kanban), combo KPI+gráfico inédito (anillos+barras-ranking), iconos sin-iconos frente al lucide-grueso vecino, estrella propia (La Silla) y un componente del patrón por defecto eliminado (buscador). Correcciones del Abogado aplicadas: iconos = sin-iconos, accent a oxblood con latón sólo de filete, `pendiente` en ámbar frío separado del latón, y la estrella cerrada en la grilla (no en el poste giratorio) para no reintroducir el cliché vetado.
