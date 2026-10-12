-- ============================================================
-- Navaja Barbershop · esquema inicial (Supabase / Postgres 15+)
-- Derivado de modules/*/api.ts y modules/*/data.json
-- Es el mismo SQL de la sección 3.2 de docs/IMPLEMENTAR.md.
-- Correlo UNA sola vez, en un proyecto de Supabase recién creado.
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
  nombre        text not null,                       -- 'Tobías Arrieta'
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
  id          text primary key,                      -- 'c01'..'c25'
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

-- ---------- config (modules/config: Local y Notificacion) ----------
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
