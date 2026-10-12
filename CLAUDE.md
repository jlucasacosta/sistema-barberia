# CLAUDE.md · Navaja Barbershop

Sistema de gestión para barberías: agenda de turnos, ventas del día, conversaciones con clientes, contactos y configuración. Next.js 15 (App Router) + TypeScript + Tailwind.

## Estado de este repo

Es un **demo frontend**: los datos viven en `modules/*/data.json`, no hay backend y nada se guarda (al recargar vuelve todo al JSON). Si la persona que te usa está convirtiéndolo en su sistema real, guiate por:

- [`docs/RECETA-CLAUDE.md`](docs/RECETA-CLAUDE.md): los pasos, en orden.
- [`docs/IMPLEMENTAR.md`](docs/IMPLEMENTAR.md): el manual con el código de referencia.
- [`docs/sql/`](docs/sql/): el esquema (`01-esquema.sql`) y los datos de ejemplo (`02-datos-ejemplo.sql`), listos para aplicar.

## Reglas que no se negocian

1. **Conectar el backend es cambiar el cuerpo de las funciones de `modules/*/api.ts`.** Nombre, parámetros y tipo de retorno no cambian. Los `index.tsx` no se tocan, salvo para conectar acciones nuevas que guardan (paso 8 de la receta).
2. **Base de datos y login: Supabase** (Postgres + Auth). Nunca Clerk.
3. **Tareas en segundo plano:** un worker aparte con pg-boss en Railway, en su propio repo. No va en este repo ni en Vercel.
4. **Secretos:** nunca en git ni en el chat. `.env.local` está ignorado y `.env.example` se sube siempre vacío. Solo `NEXT_PUBLIC_*` con la URL y la clave publicable/anon. La `service_role` vive únicamente en el worker y en scripts locales: jamás en un componente, jamás con prefijo `NEXT_PUBLIC_`.
5. **Diseño:** todo sale de `shell/theme.ts`. Ningún componente escribe un color, fuente o radio a mano. Chips con `.chip`, tarjetas con `.surface-card`.
6. **Textos visibles en español rioplatense**, con tildes, ñ y signos de apertura (¿ ¡). Voseo.
7. **Carga y errores:** cada pantalla usa `useCarga` (`shell/carga.tsx`). Si una función de `api.ts` falla, lanza el error y la pantalla muestra "Reintentar". No atrapes el error para devolver una lista vacía.
8. **Este repo parte de un demo ajeno.** `origin` tiene que apuntar al repo de la persona que te usa, nunca a `jlucasacosta/sistema-barberia`. No hagas push al original.
9. **Datos reales de clientes = repo privado.**
10. Antes de cada commit: `npm run build` sin errores.

## Mapa: módulo, funciones y tablas

| Módulo | Funciones de `api.ts` | Tablas / vistas |
|---|---|---|
| `agenda` | `getBarberos()`, `getTurnos()` | `barberos`, `servicios`, `turnos` |
| `ventas` | `getTickets()` | `tickets` |
| `contactos` | `getClientes()` | `clientes` |
| `conversaciones` | `getHilos()` | `conversaciones`, `mensajes` |
| `dashboard` | `getOcupacion()`, `getRankingServicios()`, `getActividad()` | `v_ocupacion_hoy`, `v_ranking_servicios_hoy`, `actividad` |
| `config` | `getLocal()`, `getNotificaciones()` | `ajustes`, `notificaciones` |

Los servicios (corte, fade, barba, perfilado, combo, ritual) viven en `shell/theme.ts` y, en la base, en la tabla `servicios`. En `contactos` y `ventas` el barbero viene como nombre de pila; en `agenda`, como id. La función de `api.ts` hace la traducción.

## Comandos

```bash
npm install     # dependencias
npm run dev     # http://localhost:3000
npm run build   # chequeo antes de cada commit
```

## Cómo trabajar con las cuentas de la persona

- Pedí permiso antes de cada acción sobre Supabase, Vercel, Railway o GitHub y explicá qué vas a hacer.
- Preguntá de a una cosa por vez.
- No corras ningún login (`gh auth login`, `vercel login`, `railway login`): ese paso lo hace la persona.
- No pidas ni muestres claves en el chat. Las públicas las sacás con el conector; las secretas las carga la persona en el panel del servicio.
- Un commit por paso, para poder volver atrás.
