# Implementar Navaja Barbershop con backend real

Esta guía te lleva de "clono el demo" a "mi barbería funcionando con datos reales". Está escrita para principiantes: cada comando va en un bloque que podés copiar y pegar.

> **Importante:** este repo es un demo **frontend** con datos de ejemplo. No trae backend ni dependencias de Supabase, pg-boss ni IA. Esta guía **describe** cómo agregarlos en **tu** copia. El código de las secciones 3 a 6 es de ejemplo: lo escribís vos en tu clon, no está en el repo.

---

## 0. Qué vas a lograr, en qué orden y cuánto tarda

Vas a conectar los 6 módulos del demo (dashboard, agenda, conversaciones, ventas, contactos, config) a una base de datos real con login, y a publicarlo en internet.

| Etapa | Qué hacés | Tiempo estimado |
|---|---|---|
| 1 | Clonar y correr el demo en tu compu | 15 min |
| 2 | Entender el mapa del sistema (módulo → función → tabla) | 10 min |
| 3 | Supabase: base de datos, tablas, login, conectar la primera pantalla | 2 a 3 h |
| 5 | Vercel: publicar el frontend | 30 min |
| 4 | Railway: tareas en segundo plano (recordatorios de turnos) | 1 a 2 h |
| 6 | IA: sugerir respuestas en Conversaciones | 1 a 2 h |
| 7 | Checklist de seguridad antes de cargar datos reales | 30 a 60 min |

**Orden recomendado: 1 → 2 → 3 → 5 → 4 → 6 → 7.** Publicás en Vercel (5) antes de armar el worker (4) para ver cuanto antes tu sistema en internet. Los tiempos son una guía para alguien que lo hace por primera vez.

Lo que necesitás: cuenta en [GitHub](https://github.com), [Supabase](https://supabase.com), [Vercel](https://vercel.com) y [Railway](https://railway.com). Las tres primeras tienen plan gratis para empezar; Railway cobra por uso. Revisá los precios vigentes en cada sitio antes de decidir.

---

## 1. Clonar y correr local

### 1.1 Instalá las herramientas

1. **Node.js** (versión LTS): <https://nodejs.org>
2. **Git**: <https://git-scm.com>

Verificá que quedaron instalados. Abrí una terminal y escribí:

```bash
node -v
git --version
```

Si cada comando te devuelve un número de versión, está bien. (El worker de la sección 4 pide Node 22.12 o mayor, así que conviene instalar la LTS más reciente.)

### 1.2 Clonar y correr

```bash
git clone https://github.com/jlucasacosta/sistema-barberia.git
cd sistema-barberia
npm install
npm run dev
```

Abrí <http://localhost:3000>. Vas a ver el dashboard de Navaja Barbershop.

### 1.3 Si algo falla: 3 errores típicos

| Qué ves | Qué pasa | Cómo lo arreglás |
|---|---|---|
| `'npm' no se reconoce como un comando` (o `command not found`) | Node no quedó instalado o la terminal es anterior a la instalación | Reinstalá Node desde nodejs.org, **cerrá la terminal y abrí una nueva** |
| `Port 3000 is in use` | Otro programa usa el puerto 3000 | Next te ofrece otro puerto (3001). O elegí uno: `npm run dev -- -p 3005` |
| Errores raros al instalar (`ERESOLVE`, versiones) | Node muy viejo | Actualizá Node a la LTS actual, borrá `node_modules` y repetí `npm install` |

---

## 2. Mapa de este sistema

Cada módulo tiene un archivo `api.ts` con funciones que hoy leen un `data.json`. Conectar el backend es **cambiar el cuerpo de esas funciones; la firma (nombre, parámetros, tipo de retorno) no cambia**, así que las pantallas no se tocan.

| Módulo | Funciones de `api.ts` | `data.json` (claves) | Tablas / vistas sugeridas |
|---|---|---|---|
| `agenda` | `getBarberos()`, `getTurnos()` | `barberos[]`, `turnos[]` | `barberos`, `servicios`, `turnos` |
| `ventas` | `getTickets()` | `tickets[]` | `tickets` |
| `contactos` | `getClientes()` | `clientes[]` | `clientes` |
| `conversaciones` | `getHilos()` | `hilos[]` (cada hilo trae `mensajes[]`) | `conversaciones`, `mensajes` |
| `dashboard` | `getOcupacion()`, `getRankingServicios()`, `getActividad()` | `ocupacion[]`, `rankingServicios[]`, `actividad[]` | vistas `v_ocupacion_hoy`, `v_ranking_servicios_hoy` y tabla `actividad` |
| `config` | (no tiene `api.ts`) | (no tiene `data.json`) | `ajustes`, `notificaciones` |

Los **servicios** (corte, fade, barba, perfilado, combo, ritual) hoy viven en `shell/theme.ts` (`theme.servicios`), no en un `data.json`. En la base pasan a ser la tabla `servicios`.

Dos detalles del demo que conviene saber antes de armar las tablas:

- En `contactos` y `ventas` el barbero viene como **nombre de pila** (`"Tobias"`), mientras que en `agenda` es un **id** (`"b1"`). En la base todo se relaciona por id y la función de `api.ts` devuelve el nombre de pila (ver el ejemplo de la sección 3.8).
- `visitas`, `gasto` y `ultimaVisita` de los clientes son números ya calculados. En la tabla `clientes` quedan como columnas; más adelante un job (sección 4) puede recalcularlas a partir de `tickets`.

---

## 3. Supabase: base de datos + login

[Supabase](https://supabase.com) te da una base Postgres, el login (Supabase Auth) y una API lista. **Nunca uses Clerk** en este stack: el login es Supabase Auth.

### 3.1 Crear el proyecto

1. Entrá a <https://supabase.com/dashboard> y elegí **New project**.
2. Poné un nombre (por ejemplo `tu-proyecto`), elegí la región más cercana a tus clientes y una **contraseña de base de datos**. Guardala en un gestor de contraseñas: la vas a necesitar en la sección 4.
3. Esperá a que termine de crearse.

### 3.2 Crear las tablas

En el panel: **SQL Editor → New query**, pegá este SQL entero y apretá **Run**.

Está derivado de los tipos reales de `api.ts` y de las claves de cada `data.json`. Respeta los estados reales del demo (`pendiente | confirmado | cancelado | no-vino` para turnos; `pendiente | cobrado | rechazado` para ventas), activa **RLS** (seguridad por filas) en todas las tablas y no permite que un barbero tenga dos turnos superpuestos.

```sql
-- ============================================================
-- Navaja Barbershop · esquema inicial (Supabase / Postgres 15+)
-- Derivado de modules/*/api.ts y modules/*/data.json
-- ============================================================

-- Necesaria para que un barbero no tenga dos turnos superpuestos.
create extension if not exists btree_gist with schema extensions;

-- ---------- servicios (hoy viven en shell/theme.ts -> servicios) ----------
create table public.servicios (
  id         text primary key,                       -- 'corte', 'fade', 'barba', 'perfilado', 'combo', 'ritual'
  label      text not null,                          -- 'Corte clásico'
  dur_min    integer not null check (dur_min > 0),   -- define el ALTO del bloque en la agenda
  precio     integer not null check (precio >= 0),   -- pesos enteros
  tinte      text not null check (tinte in ('corte', 'barba', 'combo'))
);

-- ---------- barberos (modules/agenda: Barbero) ----------
create table public.barberos (
  id            text primary key,                    -- 'b1'..'b4'
  nombre        text not null,                       -- 'Tobias Arrieta'
  inicial       text not null,                       -- 'TA' (avatar)
  especialidad  text not null default ''
);

-- ---------- clientes (modules/contactos: Cliente) ----------
create table public.clientes (
  id                     text primary key,           -- '1'..'30' en los datos de ejemplo
  nombre                 text not null,
  telefono               text not null default '',
  email                  text not null default '',
  barbero_fijo_id        text references public.barberos (id) on delete set null,
  servicio_habitual_id   text references public.servicios (id) on delete set null,
  fidelidad              text not null default 'nuevo' check (fidelidad in ('nuevo', 'habitual', 'vip')),
  ultima_visita          date,                       -- la UI la muestra como DD/MM
  visitas                integer not null default 0 check (visitas >= 0),
  gasto                  integer not null default 0 check (gasto >= 0)
);
create index clientes_barbero_fijo_idx on public.clientes (barbero_fijo_id);
create index clientes_telefono_idx on public.clientes (telefono);

-- ---------- turnos (modules/agenda: Turno) ----------
create table public.turnos (
  id           text primary key,                     -- 't01'..'t22'
  barbero_id   text not null references public.barberos (id) on delete restrict,
  servicio_id  text not null references public.servicios (id) on delete restrict,
  cliente_id   text references public.clientes (id) on delete set null,
  cliente      text not null,                        -- nombre que muestra la grilla
  fecha        date not null default (now() at time zone 'America/Argentina/Buenos_Aires')::date,
  inicio       time not null,                        -- 'HH:MM', alineado a franjas de 30 min
  fin          time not null,                        -- inicio + duracion del servicio (finDe() en shell/agenda.ts)
  estado       text not null default 'pendiente'
               check (estado in ('pendiente', 'confirmado', 'cancelado', 'no-vino')),
  recordatorio_enviado_at timestamptz,               -- lo completa el worker (pg-boss) al avisar al cliente
  check (fin > inicio),
  -- Un barbero no puede tener dos turnos activos que se pisen.
  constraint turnos_sin_solape exclude using gist (
    barbero_id with =,
    tsrange((fecha + inicio), (fecha + fin), '[)') with &&
  ) where (estado in ('pendiente', 'confirmado'))
);
create index turnos_fecha_barbero_idx on public.turnos (fecha, barbero_id);
create index turnos_estado_idx on public.turnos (estado);

-- ---------- tickets (modules/ventas: Ticket) ----------
create table public.tickets (
  id          text primary key,                      -- 'c01'..'c28'
  cliente_id  text references public.clientes (id) on delete set null,
  cliente     text not null,
  barbero_id  text not null references public.barberos (id) on delete restrict,
  items       text[] not null default '{}',          -- ['Corte clásico', 'Cera fijadora']
  total       integer not null check (total >= 0),
  metodo      text not null check (metodo in ('Efectivo', 'Tarjeta', 'Transferencia', 'QR')),
  fecha       date not null default (now() at time zone 'America/Argentina/Buenos_Aires')::date,
  hora        time not null,                         -- 'HH:MM'
  estado      text not null default 'pendiente' check (estado in ('pendiente', 'cobrado', 'rechazado'))
);
create index tickets_fecha_estado_idx on public.tickets (fecha, estado);
create index tickets_barbero_idx on public.tickets (barbero_id);

-- ---------- conversaciones + mensajes (modules/conversaciones: Hilo, Mensaje) ----------
create table public.conversaciones (
  id                text primary key,                -- 'h1'..'h14'
  cliente_id        text references public.clientes (id) on delete set null,
  cliente           text not null,
  canal             text not null check (canal in ('WhatsApp', 'Instagram')),
  sin_leer          integer not null default 0 check (sin_leer >= 0),
  ultimo_mensaje_at timestamptz not null default now()
);
create index conversaciones_ultimo_idx on public.conversaciones (ultimo_mensaje_at desc);

create table public.mensajes (
  id               bigint generated always as identity primary key,
  conversacion_id  text not null references public.conversaciones (id) on delete cascade,
  de               text not null check (de in ('cliente', 'local')),
  texto            text not null,
  enviado_at       timestamptz not null default now()
);
create index mensajes_conversacion_idx on public.mensajes (conversacion_id, enviado_at);

-- ---------- actividad del dashboard (modules/dashboard: Actividad) ----------
create table public.actividad (
  id           bigint generated always as identity primary key,
  ocurrio_at   timestamptz not null default now(),
  texto        text not null,
  tipo         text not null check (tipo in ('cobro', 'turno', 'rechazo', 'mensaje'))
);
create index actividad_ocurrio_idx on public.actividad (ocurrio_at desc);

-- ---------- config (modules/config: hoy es estatico) ----------
create table public.ajustes (
  clave  text primary key,                           -- 'local.nombre', 'local.direccion', 'horario.apertura'...
  valor  jsonb not null
);
create table public.notificaciones (
  clave   text primary key,                          -- 'recordatorio_turno'
  label   text not null,                             -- 'Recordatorio de turno por WhatsApp'
  activo  boolean not null default true
);

-- ---------- vistas del dashboard (Ocupacion, RankItem) ----------
-- 660 = minutos entre apertura (09:00) y cierre (20:00). Si cambias el horario, cambia este numero.
create view public.v_ocupacion_hoy with (security_invoker = true) as
select
  b.id                                         as barbero_id,
  split_part(b.nombre, ' ', 1)                 as nombre,
  b.inicial,
  round(coalesce(sum(extract(epoch from (t.fin - t.inicio)) / 60), 0) / 660.0, 2)::float8 as pct,
  count(t.id)::int                             as turnos
from public.barberos b
left join public.turnos t
  on t.barbero_id = b.id
 and t.fecha = (now() at time zone 'America/Argentina/Buenos_Aires')::date
 and t.estado in ('pendiente', 'confirmado')
group by b.id, b.nombre, b.inicial;

create view public.v_ranking_servicios_hoy with (security_invoker = true) as
select s.label, count(*)::int as valor
from public.turnos t
join public.servicios s on s.id = t.servicio_id
where t.fecha = (now() at time zone 'America/Argentina/Buenos_Aires')::date
  and t.estado in ('pendiente', 'confirmado')
group by s.label
order by valor desc;

-- ---------- RLS: nada se lee ni se escribe sin iniciar sesion ----------
alter table public.servicios       enable row level security;
alter table public.barberos        enable row level security;
alter table public.clientes        enable row level security;
alter table public.turnos          enable row level security;
alter table public.tickets         enable row level security;
alter table public.conversaciones  enable row level security;
alter table public.mensajes        enable row level security;
alter table public.actividad       enable row level security;
alter table public.ajustes         enable row level security;
alter table public.notificaciones  enable row level security;

-- Politica de EJEMPLO: cualquier usuario autenticado (tu equipo) lee y escribe todo.
-- Solo es seguro si desactivas "Allow new users to sign up" en Authentication.
create policy "equipo accede" on public.servicios      for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.barberos       for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.clientes       for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.turnos         for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.tickets        for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.conversaciones for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.mensajes       for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.actividad      for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.ajustes        for all to authenticated using (true) with check (true);
create policy "equipo accede" on public.notificaciones for all to authenticated using (true) with check (true);
```

Qué hace cada parte, en criollo:

- **`primary key` / `references`**: cada fila tiene un identificador único y los turnos apuntan a un barbero y a un servicio que existen.
- **`check (...)`**: la base rechaza estados inventados (por ejemplo un turno `"quizas"`).
- **`turnos_sin_solape`**: dos turnos activos del mismo barbero no pueden pisarse. Los cancelados y los "no vino" no bloquean.
- **Índices**: aceleran las consultas que hace la app (turnos por día y barbero, tickets por estado, mensajes por conversación).
- **`enable row level security`**: la tabla queda **cerrada** para cualquiera que no haya iniciado sesión. Sin esa línea, cualquiera con la clave pública podría leer o borrar todo.
- **Políticas `equipo accede`**: ejemplo para un solo local: cualquier usuario **autenticado** puede leer y escribir todo. Es seguro solo si únicamente tu equipo puede crear usuarios (ver 3.3). Si algún día tenés varios locales, agregá una columna `local_id` y restringí con `using (local_id = ...)`.
- **Zona horaria**: las fechas "de hoy" usan `America/Argentina/Buenos_Aires`. Si tu local está en otro país, cambiá ese texto en el SQL.

Verificá en **Table Editor** que aparecen las 10 tablas.

### 3.3 Login (Supabase Auth)

1. **Authentication → Users → Add user**: creá un usuario para vos (email + contraseña).
2. En **Authentication**, desactivá los registros públicos (la opción se llama *Allow new users to sign up* o *User Signups*, según la versión del panel). Así solo entran las personas que creás vos. **Esto es obligatorio** porque las políticas del ejemplo dejan pasar a cualquier usuario autenticado.
3. Más adelante, cuando tengas tu dominio, cargalo en **Authentication → URL Configuration** (Site URL y Redirect URLs).

### 3.4 Cargar los datos de ejemplo

Para ver tu sistema lleno desde el primer día, cargá los datos del demo.

**Opción A (recomendada): un script.** Primero hacé la sección 3.5 (variables de entorno) y 3.6 (instalar supabase-js). Después creá el archivo `scripts/importar-datos.mjs` con este contenido:

```js
// scripts/importar-datos.mjs  (lo creas VOS en tu clon; no viene en el repo)
// Carga los datos de ejemplo (modules/*/data.json) en tus tablas de Supabase.
// Uso:  node --env-file=.env.local scripts/importar-datos.mjs
import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "node:fs"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY // clave de servidor: solo en tu maquina
if (!url || !key) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local")
const supabase = createClient(url, key, { auth: { persistSession: false } })

const leer = (modulo) => JSON.parse(readFileSync(`modules/${modulo}/data.json`, "utf8"))
const pad = (n) => String(n).padStart(2, "0")

async function guardar(tabla, filas) {
  const { error } = await supabase.from(tabla).upsert(filas)
  if (error) throw new Error(`${tabla}: ${error.message}`)
  console.log(`${tabla}: ${filas.length} filas`)
}
async function reemplazar(tabla, filas) {
  // Tablas con id automatico: se vacian y se vuelven a cargar para poder repetir el script.
  const borrar = await supabase.from(tabla).delete().gte("id", 0)
  if (borrar.error) throw new Error(`${tabla}: ${borrar.error.message}`)
  const { error } = await supabase.from(tabla).insert(filas)
  if (error) throw new Error(`${tabla}: ${error.message}`)
  console.log(`${tabla}: ${filas.length} filas`)
}
const sumarMin = (hhmm, min) => {
  const [h, m] = hhmm.split(":").map(Number)
  const t = h * 60 + m + min
  return `${pad(Math.floor(t / 60))}:${pad(t % 60)}`
}

// 1) Servicios: salen de shell/theme.ts (si cambias precios alla, cambialos aca tambien).
const servicios = [
  { id: "corte", label: "Corte clásico", dur_min: 30, precio: 450, tinte: "corte" },
  { id: "fade", label: "Fade", dur_min: 30, precio: 550, tinte: "corte" },
  { id: "barba", label: "Barba", dur_min: 30, precio: 350, tinte: "barba" },
  { id: "perfilado", label: "Perfilado", dur_min: 30, precio: 300, tinte: "barba" },
  { id: "combo", label: "Corte + barba", dur_min: 60, precio: 750, tinte: "combo" },
  { id: "ritual", label: "Ritual completo", dur_min: 90, precio: 1100, tinte: "combo" },
]
await guardar("servicios", servicios)

// 2) Barberos
const agenda = leer("agenda")
await guardar("barberos", agenda.barberos)

// En clientes y tickets el barbero viene como nombre de pila ("Tobias"): lo convertimos a id.
const barberoPorNombre = Object.fromEntries(agenda.barberos.map((b) => [b.nombre.split(" ")[0], b.id]))
const servicioPorLabel = Object.fromEntries(servicios.map((s) => [s.label, s.id]))
const durPorId = Object.fromEntries(servicios.map((s) => [s.id, s.dur_min]))

// 3) Clientes ("DD/MM" -> fecha; si todavia no llego ese dia este anio, es del anio pasado)
const hoy = new Date()
const clientes = leer("contactos").clientes.map((c) => {
  const [dd, mm] = c.ultimaVisita.split("/").map(Number)
  const anio = new Date(hoy.getFullYear(), mm - 1, dd) > hoy ? hoy.getFullYear() - 1 : hoy.getFullYear()
  return {
    id: c.id,
    nombre: c.nombre,
    telefono: c.telefono,
    email: c.email,
    barbero_fijo_id: barberoPorNombre[c.barberoFijo] ?? null,
    servicio_habitual_id: servicioPorLabel[c.servicioHabitual] ?? null,
    fidelidad: c.fidelidad,
    ultima_visita: `${anio}-${pad(mm)}-${pad(dd)}`,
    visitas: c.visitas,
    gasto: c.gasto,
  }
})
await guardar("clientes", clientes)

// 4) Turnos de HOY (hora de Argentina). La columna `fin` se calcula con la duracion del servicio.
const fechaHoy = hoy.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" })
await guardar(
  "turnos",
  agenda.turnos.map((t) => ({
    id: t.id,
    barbero_id: t.barberoId,
    servicio_id: t.servicio,
    cliente: t.cliente,
    fecha: fechaHoy,
    inicio: t.inicio,
    fin: sumarMin(t.inicio, durPorId[t.servicio]),
    estado: t.estado,
  })),
)

// 5) Tickets de ventas
await guardar(
  "tickets",
  leer("ventas").tickets.map((t) => ({
    id: t.id,
    cliente: t.cliente,
    barbero_id: barberoPorNombre[t.barbero],
    items: t.items,
    total: t.total,
    metodo: t.metodo,
    fecha: fechaHoy,
    hora: t.hora,
    estado: t.estado,
  })),
)

// 6) Conversaciones y mensajes. En el JSON la hora puede ser "09:12" o un texto ("Ayer", "Mar"):
//    si no es HH:MM, el mensaje queda fechado ayer a las 12:00.
const hilos = leer("conversaciones").hilos
await guardar(
  "conversaciones",
  hilos.map((h) => ({ id: h.id, cliente: h.cliente, canal: h.canal, sin_leer: h.sinLeer })),
)
const aFecha = (hora) => {
  const d = new Date()
  if (/^\d{2}:\d{2}$/.test(hora)) {
    const [h, m] = hora.split(":").map(Number)
    d.setHours(h, m, 0, 0)
  } else {
    d.setDate(d.getDate() - 1)
    d.setHours(12, 0, 0, 0)
  }
  return d.toISOString()
}
await reemplazar(
  "mensajes",
  hilos.flatMap((h) =>
    h.mensajes.map((m) => ({ conversacion_id: h.id, de: m.de, texto: m.texto, enviado_at: aFecha(m.hora) })),
  ),
)

// 7) Actividad del dashboard
await reemplazar(
  "actividad",
  leer("dashboard").actividad.map((a) => ({ ocurrio_at: aFecha(a.hora), texto: a.texto, tipo: a.tipo })),
)

// 8) Notificaciones de Config (hoy estan escritas dentro de modules/config/index.tsx)
await guardar("notificaciones", [
  { clave: "recordatorio_turno", label: "Recordatorio de turno por WhatsApp", activo: true },
  { clave: "silla_libre", label: "Aviso de silla libre para clientes sin turno", activo: true },
  { clave: "encuesta", label: "Encuesta post-servicio", activo: false },
  { clave: "cumpleanos", label: "Promoción de cumpleaños del cliente", activo: true },
])
console.log("Listo.")
```

y ejecutalo una sola vez desde la carpeta del proyecto:

```bash
node --env-file=.env.local scripts/importar-datos.mjs
```

El script usa la `service_role`, que **solo corre en tu computadora** (ver 3.5). Si falla, el mensaje te dice qué tabla dio error.

**Opción B: CSV a mano.** En **Table Editor → (tabla) → Insert → Import data from CSV**. Sirve para tablas chicas como `barberos`, pero no para `turnos` ni `clientes`, porque ahí hay que traducir nombres a ids (lo que hace el script). Por eso la recomendación es la opción A.

> Los turnos y tickets de ejemplo se cargan con la fecha de **hoy**. Mañana tu agenda de "hoy" va a estar vacía: es lo esperado, ya que los datos reales los vas a ir creando vos.

### 3.5 Variables de entorno

En la raíz del proyecto hay un archivo `.env.example` con todos los nombres y los valores vacíos. Copialo:

```bash
cp .env.example .env.local
```

(En Windows PowerShell: `Copy-Item .env.example .env.local`.)

Completá en `.env.local` los valores que ves en **Project Settings → API** (y **Connect** para la cadena de la base):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-o-publishable
SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role
```

Reglas que no se negocian:

- `NEXT_PUBLIC_*` viaja al navegador. Eso está bien para la URL y la clave **anon/publishable**: la protección real la dan las políticas RLS.
- **`SUPABASE_SERVICE_ROLE_KEY` se salta toda la seguridad.** Jamás lleva el prefijo `NEXT_PUBLIC_`, jamás se importa desde un componente del navegador y jamás se sube a git. La usan solo el script de importación (tu compu) y el worker (sección 4).
- `.env.local` está en `.gitignore`. `.env.example` se sube **siempre vacío**.
- Después de editar `.env.local`, **reiniciá** `npm run dev`.

### 3.6 Instalar el cliente

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 3.7 Dónde se crea el cliente: `lib/supabase`

Creá estos archivos en tu proyecto (no vienen en el demo). La sintaxis es la de la documentación actual de Supabase para Next.js con App Router.

**`lib/supabase/client.ts`**: para componentes de cliente (los módulos del demo son `"use client"`):

```ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

**`lib/supabase/server.ts`**: para Server Components, Route Handlers y Server Actions:

```ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Se llamó desde un Server Component: se puede ignorar si el middleware refresca la sesión.
          }
        },
      },
    },
  )
}
```

**`lib/supabase/middleware.ts`**: refresca la sesión y manda al login a quien no inició sesión:

```ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // No pongas código entre createServerClient y getUser(): puede desloguear usuarios al azar.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }
  return supabaseResponse
}
```

**`middleware.ts`** (en la raíz del proyecto, al lado de `package.json`):

```ts
import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
```

> Supabase también ofrece `supabase.auth.getClaims()` en versiones nuevas de la librería. `getUser()` funciona en todas y siempre valida contra el servidor.

**Pantalla de login, `app/login/page.tsx`:**

```tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) return setError("Email o contraseña incorrectos")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={entrar} className="mx-auto mt-20 flex max-w-sm flex-col gap-3">
      <h1 className="font-heading text-4xl">INGRESAR</h1>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded border border-border bg-surface px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Contraseña
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded border border-border bg-surface px-3 py-2" />
      </label>
      {error && <p role="alert" className="text-sm text-danger-ink">{error}</p>}
      <button type="submit" className="chip chip-btn bg-accent text-surface">Entrar</button>
    </form>
  )
}
```

Para cerrar sesión: `await createClient().auth.signOut()` desde un botón en el topbar.

**El `auth-stub` del shell.** `shell/auth-stub.ts` es solo un placeholder del demo (no lo usa ninguna pantalla). Cuando tengas el login andando, borralo: la sesión real sale de `supabase.auth.getUser()` (en el servidor) o `getSession()` (en el cliente).

### 3.8 Antes y después: el cuerpo de UNA función

Tomemos `getTurnos()` de `modules/agenda/api.ts`. **La firma no cambia**: sigue devolviendo `Promise<Turno[]>`. Solo cambia lo de adentro.

**ANTES (demo):**

```ts
export async function getTurnos(): Promise<Turno[]> {
  await sleep(300)
  return structuredClone(raw.turnos) as Turno[]
}
```

**DESPUÉS (Supabase):**

```ts
import { createClient } from "@/lib/supabase/client"

export async function getTurnos(): Promise<Turno[]> {
  const supabase = createClient()
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }) // AAAA-MM-DD

  const { data, error } = await supabase
    .from("turnos")
    .select("id, barbero_id, servicio_id, cliente, inicio, estado")
    .eq("fecha", hoy)
    .order("inicio", { ascending: true })

  if (error) throw new Error(`No se pudieron cargar los turnos: ${error.message}`)

  // La base usa snake_case y la hora como "09:00:00". La pantalla espera camelCase y "09:00".
  return (data ?? []).map((t) => ({
    id: t.id,
    barberoId: t.barbero_id,
    inicio: t.inicio.slice(0, 5),
    servicio: t.servicio_id as Turno["servicio"],
    cliente: t.cliente,
    estado: t.estado as Turno["estado"],
  }))
}
```

Para que un error no deje la pantalla muda, en `modules/agenda/index.tsx` agregá un `.catch` donde se llama a la función (es una línea de UI, no cambia ninguna firma):

```ts
getTurnos().then(setTurnos).catch(() => setTurnos([]))
```

Si ves la lista vacía y **sin error**, casi siempre es RLS: todavía no iniciaste sesión (ver sección 8).

Las demás funciones siguen el mismo patrón: `.from("tabla").select(...)`, chequear `error`, y mapear a la forma del tipo. Por ejemplo, `getTickets()` lee `tickets` con `barberos(nombre)` y devuelve `barbero: fila.barberos.nombre.split(" ")[0]`; `getOcupacion()` lee la vista `v_ocupacion_hoy`.

### 3.9 Lo que pasa con las acciones de la UI

En el demo, "Confirmar", "Mover silla", "Cobrar" y "Rechazar" solo cambian el estado en pantalla. Con backend real, cada una pasa a ser un `update` (por ejemplo `supabase.from("turnos").update({ estado: "confirmado" }).eq("id", id)`). Eso requiere agregar funciones nuevas en cada `api.ts` (`confirmarTurno`, `cobrarTicket`...). Es trabajo de tu implementación; el demo no las trae.

### 3.10 Tiempo real (opcional)

Para que el inbox y la agenda se actualicen solos, habilitá Realtime en las tablas que cambian:

```sql
alter publication supabase_realtime add table public.mensajes, public.turnos;
```

y suscribite con `supabase.channel(...).on("postgres_changes", ...)` desde el cliente (ver la guía de Realtime de Supabase).

### 3.11 Tipos automáticos (opcional)

Con la [CLI de Supabase](https://supabase.com/docs/guides/local-development) podés generar los tipos de tus tablas:

```bash
npx supabase gen types typescript --project-id tu-proyecto --schema public > lib/supabase/database.types.ts
```

---

## 4. Railway: tareas en segundo plano (pg-boss)

### 4.1 Para qué sirve, en criollo

Tu app en Vercel responde cuando alguien entra. Pero hay trabajo que **tiene que pasar solo, a una hora**, aunque nadie esté mirando la pantalla. Eso lo hace un **worker**: un programa que queda prendido en [Railway](https://railway.com) y usa [pg-boss](https://github.com/timgit/pg-boss), una cola de tareas que guarda sus trabajos en tu **misma base de Supabase** (no necesitás Redis ni otro servicio).

Casos de una barbería que lo necesitan:

- **Recordatorio de turno** por WhatsApp 24 horas antes (el que muestra Config como "Recordatorio de turno por WhatsApp").
- **Aviso de silla libre**: cuando se cancela un turno, avisar a los clientes que pidieron lugar ("Aviso de silla libre para clientes sin turno").
- **Resumen del cierre**: todos los días a las 21:00, armar el resumen de ventas y mandarlo por mail al dueño.
- **Recalcular clientes**: cada noche actualizar `visitas`, `gasto`, `ultima_visita` y `fidelidad` (VIP/habitual) desde `tickets`.
- **Reintentar mensajes** que no pudieron salir.
- **Cumpleaños**: promoción automática ("Promoción de cumpleaños del cliente").

### 4.2 Qué cadena de conexión usar (directa vs pooler)

El worker habla con Postgres directamente. Supabase ofrece tres cadenas (en el panel, botón **Connect**):

| Cadena | Puerto | Para qué | ¿Para pg-boss? |
|---|---|---|---|
| **Directa** (`db.tu-proyecto.supabase.co`) | 5432 | Servidores que quedan prendidos | Sí, pero según la documentación de Supabase usa IPv6 salvo que contrates el add-on IPv4 |
| **Pooler, modo sesión** (`...pooler.supabase.com`) | 5432 | Servidores prendidos que necesitan IPv4 | **Sí. Es la recomendada para Railway** |
| **Pooler, modo transacción** | 6543 | Funciones serverless (Vercel) | **No.** pg-boss mantiene conexiones persistentes |

Empezá con la de **modo sesión**: funciona sin depender de IPv6. Es una recomendación basada en la documentación de ambos servicios; no la probamos contra tu proyecto. Si ves un error de SSL o de certificado, probá agregar `?sslmode=require` a la cadena.

La cadena lleva tu contraseña de base de datos: **guardala solo en las variables de Railway**, nunca en un archivo del repo.

### 4.3 Crear el worker

El worker es un proyecto aparte de tu frontend (su propio repo privado, por ejemplo `navaja-worker`). Esto es solo un **esqueleto de ejemplo**: no forma parte de este repo.

```bash
mkdir navaja-worker
cd navaja-worker
npm init -y
npm pkg set type=module scripts.start="node index.js"
npm install pg-boss @supabase/supabase-js
```

pg-boss pide Node 22.12 o mayor según su documentación. Railway usa una versión de Node por defecto; si tu build falla por eso, fijala con la variable `NODE_VERSION` o con `"engines": { "node": ">=22.12.0" }` en `package.json`.

**`index.js`** (recordatorios de turno 24 h antes):

```js
import { PgBoss } from "pg-boss"
import { createClient } from "@supabase/supabase-js"

// Cliente con service_role: corre SOLO acá, en el servidor del worker.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const boss = new PgBoss(process.env.DATABASE_URL)
boss.on("error", (err) => console.error("pg-boss:", err))
await boss.start() // crea su propio esquema `pgboss` la primera vez

await boss.createQueue("planificar-recordatorios")
await boss.createQueue("recordatorio-turno")

// Cada 15 minutos: ¿qué turnos confirmados empiezan en las próximas 24 h y no avisamos?
await boss.schedule("planificar-recordatorios", "*/15 * * * *", {}, { tz: "America/Argentina/Buenos_Aires" })

await boss.work("planificar-recordatorios", async () => {
  const ahora = Date.now()
  const { data, error } = await supabase
    .from("turnos")
    .select("id, fecha, inicio")
    .eq("estado", "confirmado")
    .is("recordatorio_enviado_at", null)
    .gte("fecha", new Date(ahora).toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }))
  if (error) throw error // pg-boss reintenta solo

  for (const t of data) {
    // Argentina no tiene horario de verano: UTC-3 fijo. Ajustá si tu país es otro.
    const empieza = new Date(`${t.fecha}T${t.inicio}-03:00`).getTime()
    if (empieza > ahora && empieza - ahora <= 24 * 60 * 60 * 1000) {
      await boss.send("recordatorio-turno", { turnoId: t.id })
    }
  }
})

await boss.work("recordatorio-turno", async ([job]) => {
  const { turnoId } = job.data
  const { data: turno, error } = await supabase
    .from("turnos")
    .select("id, cliente, inicio, recordatorio_enviado_at, clientes(telefono)")
    .eq("id", turnoId)
    .single()
  if (error) throw error
  if (turno.recordatorio_enviado_at) return // ya se avisó: no repetir

  await enviarWhatsApp(turno.clientes?.telefono, `Hola ${turno.cliente}, te esperamos mañana a las ${turno.inicio.slice(0, 5)} en Navaja.`)

  await supabase.from("turnos").update({ recordatorio_enviado_at: new Date().toISOString() }).eq("id", turnoId)
})

// Acá va TU proveedor (por ejemplo la API de WhatsApp Business de Meta o Twilio).
// Este ejemplo solo escribe en el log; no envía nada.
async function enviarWhatsApp(telefono, texto) {
  console.log("[simulado] WhatsApp a", telefono, "->", texto)
}

// Railway avisa con SIGTERM antes de apagar: cerramos pg-boss con orden.
process.on("SIGTERM", async () => {
  await boss.stop()
  process.exit(0)
})
```

Los turnos de ejemplo no traen `cliente_id`, así que el teléfono llega vacío: cuando crees turnos reales, guardá el id del cliente para que el worker encuentre su teléfono.

Cómo leerlo: `schedule` programa un trabajo con cron; `work` registra quién lo procesa; si el handler lanza un error, pg-boss lo reintenta (por defecto 2 veces); `send` encola un trabajo nuevo. La columna `recordatorio_enviado_at` (ya incluida en el SQL de la sección 3.2) evita avisar dos veces.

### 4.4 Pasos en Railway

1. Subí `navaja-worker` a un repo de GitHub (privado).
2. En <https://railway.com>: **New Project → Deploy from GitHub repo** y elegí el repo del worker.
3. Entrá al servicio → **Settings → Deploy → Custom Start Command** y poné `npm start` (o `node index.js`).
4. **No le generes dominio público**: un worker no recibe visitas, solo trabaja.
5. Pestaña **Variables**, cargá:

```bash
DATABASE_URL=la-cadena-del-pooler-en-modo-sesion
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role
```

6. **Deploy**. En **Logs** tenés que ver que arrancó sin errores. Para probar rápido, bajá el cron a `* * * * *` (cada minuto) un rato y volvelo a `*/15`.

Los nombres de los botones de Railway pueden cambiar; la idea (repo → comando de arranque → variables → logs) es la misma.

---

## 5. Vercel: publicar el frontend

1. **Subí tu copia a tu propio GitHub.** Tu clon apunta al repo del demo; creá un repo vacío en tu cuenta y reapuntalo:

```bash
git remote set-url origin https://github.com/TU-USUARIO/tu-repo.git
git push -u origin master
```

2. En <https://vercel.com/new>: **Import** tu repo. Vercel detecta **Next.js** solo; no toques nada de build.
3. Antes de **Deploy**, abrí **Environment Variables** y cargá las variables que usa el frontend. Marcá los entornos **Production** y **Preview**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-o-publishable
```

Solo si usás IA (sección 6) sumá `OPENAI_API_KEY` y `OPENAI_MODEL`. **No cargues `SUPABASE_SERVICE_ROLE_KEY` en Vercel** salvo que un Route Handler de servidor la necesite de verdad.

4. **Deploy**. Cuando termine, Vercel te da una URL `*.vercel.app`.
5. **Dominio propio:** *Project → Settings → Domains → Add*. Vercel te dice qué registro DNS crear en tu proveedor del dominio.
6. **Redeploy automático:** cada `git push` a la rama de producción vuelve a publicar solo. Si tu rama se llama `master`, en *Settings → Git* ponela como **Production Branch**; si no, Vercel puede tratar tus pushes como previews.
7. Volvé a Supabase (**Authentication → URL Configuration**) y cargá tu URL de Vercel (y tu dominio) como Site URL / Redirect URLs.

**Si el build falla:**

- Abrí el deployment fallido y leé el log **de abajo hacia arriba**: el error real está al final.
- Reproducilo en tu compu: `npm run build`. Lo que falla en Vercel casi siempre falla igual en local.
- Errores de TypeScript: `npx tsc --noEmit` te los lista.
- "Missing env" / cliente `undefined`: faltan variables en Vercel. Las `NEXT_PUBLIC_*` se incorporan **al construir**: si las cambiás, tenés que hacer **Redeploy**.

---

## 6. IA (OpenAI o Gemini) en este nicho

Este sistema no trae un módulo "agente-ia". Los lugares donde la IA aporta valor en una barbería son:

- **Conversaciones**: sugerir una respuesta a una consulta de WhatsApp/Instagram ("¿Cuánto sale la barba?", "¿Tienen lugar hoy a la mañana?"). El barbero **revisa y envía**; la IA no responde sola.
- **Dashboard**: un resumen en lenguaje natural del cierre del día ("hoy se cobraron X, hubo 2 rechazos, la silla de Nicolás tuvo poca ocupación"), generado por un job del worker.

**Regla de oro: la clave de IA vive solo en el servidor.** Nunca en un componente `"use client"`, nunca con prefijo `NEXT_PUBLIC_`. El navegador llama a **tu** endpoint y tu endpoint llama a la IA.

Variables (en `.env.local` y en Vercel):

```bash
OPENAI_API_KEY=tu-clave
OPENAI_MODEL=el-modelo-que-elegiste
```

Elegí el modelo desde la lista de tu cuenta de OpenAI y guardalo en `OPENAI_MODEL`, así no queda fijo en el código ni se te desactualiza.

```bash
npm install openai
```

Ejemplo mínimo, un Route Handler **`app/api/sugerir-respuesta/route.ts`**:

```ts
import OpenAI from "openai"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  // 1) Solo usuarios con sesión.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  // 2) Validar la entrada.
  const { conversacionId } = await req.json()
  if (typeof conversacionId !== "string") return NextResponse.json({ error: "Falta conversacionId" }, { status: 400 })

  // 3) Contexto: últimos mensajes y lista de precios REAL (para que no invente).
  const [{ data: mensajes }, { data: servicios }] = await Promise.all([
    supabase.from("mensajes").select("de, texto").eq("conversacion_id", conversacionId).order("enviado_at", { ascending: false }).limit(10),
    supabase.from("servicios").select("label, precio, dur_min"),
  ])
  const historial = (mensajes ?? []).reverse().map((m) => `${m.de === "cliente" ? "Cliente" : "Barbería"}: ${m.texto}`).join("\n")
  const precios = (servicios ?? []).map((s) => `${s.label}: $${s.precio} (${s.dur_min} min)`).join("\n")

  // 4) Llamar al modelo.
  try {
    const respuesta = await openai.responses.create({
      model: process.env.OPENAI_MODEL!,
      instructions: `Sos el asistente de una barbería. Redactá UNA respuesta corta, amable y en voseo para el último mensaje del cliente. Usá solo estos precios y duraciones; si no sabés algo, decí que lo confirman en el local.\n${precios}`,
      input: historial,
      max_output_tokens: 200,
    })
    return NextResponse.json({ texto: respuesta.output_text })
  } catch {
    return NextResponse.json({ error: "El asistente no está disponible" }, { status: 502 })
  }
}
```

Si preferís **Gemini**, el esquema es idéntico (endpoint de servidor, clave en `GEMINI_API_KEY`) con el SDK `@google/genai`; seguí su guía oficial: <https://ai.google.dev/gemini-api/docs>.

**Costos y límites a vigilar:**

- Se paga **por tokens** (lo que mandás + lo que responde). Revisá la tabla de precios vigente de tu proveedor antes de lanzar.
- Poné **`max_output_tokens`** (como arriba) y limitá cuántos mensajes de historial mandás.
- Configurá un **límite de gasto mensual** y alertas en el panel de tu proveedor.
- Poné un **límite de uso por usuario** (por ejemplo, N sugerencias por minuto) para que un bug o un abuso no te vacíe el crédito.
- Manejá el error 429 (límite del proveedor) con un mensaje claro, sin reintentar en bucle.
- Mandá solo lo necesario: evitá teléfonos y datos personales dentro del prompt.

---

## 7. Checklist de seguridad antes de publicar con datos reales

- [ ] **RLS activado** en todas las tablas de `public` (`alter table ... enable row level security`) y con políticas. En Supabase: **Advisors → Security** no debería marcar tablas sin RLS.
- [ ] **Registros públicos desactivados** en Authentication (las políticas de ejemplo dejan pasar a cualquier autenticado).
- [ ] **`SUPABASE_SERVICE_ROLE_KEY` fuera del cliente**: sin prefijo `NEXT_PUBLIC_`, no importada en componentes `"use client"`, solo en el worker y en scripts locales. Si alguna vez se filtró, rotala en Supabase.
- [ ] **`.env.local` ignorado por git** (`git status` no debe mostrarlo) y `.env.example` **vacío**.
- [ ] **Sin datos reales en un repo público.** Si tu copia va a tener clientes reales, hacé el repo **privado** y nunca subas exportaciones de la base.
- [ ] **Claves de IA solo en servidor** y con límite de gasto configurado.
- [ ] **Rate limiting** en los endpoints que cuestan plata o escriben (IA, webhooks): por usuario y por IP.
- [ ] **Webhooks** (WhatsApp/Meta) con verificación de firma antes de insertar en `mensajes`.
- [ ] **Backups**: revisá qué plan de Supabase incluye copias automáticas y probá restaurar al menos una vez. Si tu plan no las incluye, exportá la base a un archivo con una rutina propia.
- [ ] **Contraseñas fuertes** (y, si tu plan lo permite, doble factor) para las cuentas de Supabase, Vercel, Railway y GitHub.
- [ ] **Cumplimiento**: pedí consentimiento antes de mandar mensajes automáticos de WhatsApp o promociones y respetá la ley de protección de datos personales de tu país.

---

## 8. Errores comunes y cómo resolverlos

| Qué ves | Causa probable | Solución |
|---|---|---|
| La lista aparece **vacía y sin error** | RLS está bloqueando: no hay sesión iniciada | Iniciá sesión en `/login`; verificá que el middleware redirige y que tenés políticas `to authenticated` |
| `new row violates row-level security policy for table "turnos"` | Estás insertando sin sesión o falta una política de `insert` | Insertá con un usuario autenticado; revisá las políticas de la tabla |
| `relation "public.turnos" does not exist` | No ejecutaste el SQL, o falló a mitad de camino | Volvé a **SQL Editor** y corré el SQL entero; mirá si hubo un error rojo |
| `Invalid API key` o `supabaseUrl is required` | Falta `.env.local` o tiene un nombre mal escrito | Revisá los nombres exactos (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) y **reiniciá** `npm run dev` |
| Cambié una variable `NEXT_PUBLIC_*` y no se nota | Se incorpora al construir | Local: reiniciá el dev server. Vercel: **Redeploy** |
| `conflicting key value violates exclusion constraint "turnos_sin_solape"` | Ese barbero ya tiene un turno activo en ese horario | Es la regla funcionando: elegí otro horario o cancelá el otro turno |
| El script de importación dice `invalid input syntax` o `violates check constraint` | Un dato del JSON no calza con el esquema | Mirá el nombre de tabla del mensaje y compará con el SQL de la sección 3.2 |
| Worker: `ENOTFOUND` o `ENETUNREACH` al conectar | Estás usando la cadena **directa** (IPv6) desde un servidor sin IPv6 | Usá la cadena del **pooler en modo sesión** |
| Worker: `Tenant or user not found` | Usuario de la cadena del pooler mal armado | Copiá la cadena completa desde **Connect** (el usuario lleva el id del proyecto: `postgres.tu-proyecto`) |
| Worker: errores de módulo / de sintaxis `import` | Falta `"type": "module"` o Node es viejo | `npm pkg set type=module` y Node 22.12+ |
| Después de loguearte, volvés siempre a `/login` | Cookies de sesión no se refrescan: falta el `middleware.ts` o el matcher las excluye | Verificá que `middleware.ts` existe en la **raíz** y usa `updateSession` |
| Build de Vercel falla con errores de TypeScript | Tipos que no calzan | `npx tsc --noEmit` en tu compu y corregí lo que liste |
| La IA responde `401` o `429` | Clave inválida (401) o límite de uso/saldo (429) | Revisá la clave y el saldo/límites en el panel del proveedor; no reintentes en bucle |

---

## 9. Siguiente paso

Ya tenés el recorrido completo: demo → base de datos → login → publicado → tareas automáticas → IA.

**Aprendé a crear tu Agencia de IA y conseguir tu primer cliente.** Eso lo trabajamos adentro del Club de la IA, nuestro Skool privado.

👉 <https://www.skool.com/club-de-la-ia-8047/about>

---

### Qué se verificó y qué no

- **Verificado:** el SQL de la sección 3.2 se ejecutó completo en un motor Postgres embebido (PGlite) cargando todos los datos de ejemplo de `data.json`: crea las 10 tablas y 2 vistas, la restricción anti-solape rechaza un turno superpuesto y deja pasar uno cancelado, y las vistas devuelven ocupación y ranking. La sintaxis de `supabase-js`, `@supabase/ssr`, `pg-boss` (incluido `schedule`, `work`, `send`) y de la API de OpenAI se contrastó con su documentación oficial el 2026-10-10.
- **No verificado:** el envío real de WhatsApp (es un stub), los nombres exactos de botones de los paneles de Supabase, Railway y Vercel (cambian con el tiempo), la conexión del worker contra un proyecto real de Supabase y el comportamiento de `pg-boss` con cada tipo de pooler (la recomendación de usar modo sesión sale de la documentación, no de una prueba).
- Licencia del repo: MIT. Podés usar y modificar este sistema libremente.
