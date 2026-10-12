# Convertí el demo en tu sistema real, con Claude Code

Esta receta lleva el demo de Navaja Barbershop a **tu barbería funcionando**: base de datos, login, publicado en internet y, si querés, recordatorios automáticos. Claude hace el trabajo; vos copiás un pedido por paso, probás y seguís.

Usa lo que ya armaste en el curso de la Agencia de IA: los conectores y las CLI de GitHub, Vercel, Supabase y Railway (módulos 04 a 08).

> **Esta receta y [`IMPLEMENTAR.md`](IMPLEMENTAR.md) son complementarias.** `IMPLEMENTAR.md` es el manual: explica cada pieza y trae el código. Esta receta es el camino rápido: los mismos pasos, convertidos en pedidos para Claude. Cada paso te dice en qué sección del manual está el detalle.

> **Recordá qué es este repo:** un demo **frontend** con datos de ejemplo que no se guardan. Todo lo de abajo lo hacés en **tu copia**, nunca en el repo del demo.

---

## Antes de empezar

### Lo que tenés que tener del curso

| Qué | Cómo sabés que está | Módulo |
|---|---|---|
| Claude Code (app Desktop) | Abrís la pestaña Code | 01 y 02 |
| Conectores y CLI | Sabés qué es un MCP y cómo se instala una CLI | 04 |
| GitHub | `gh auth login` hecho | 05 |
| Vercel | Conector agregado y `vercel login` hecho | 06 |
| Supabase | Conector agregado, skill instalada | 07 |
| Railway | Conector, CLI y skill (solo si vas a hacer el paso 10) | 08 |

### Tres reglas para toda la receta

1. **Aprobación en Manual.** Trabajás sobre cuentas reales: dejá que Claude te pida permiso antes de cada acción y leé lo que va a hacer.
2. **Ninguna clave en el chat.** Las claves públicas las saca Claude con el conector. Las secretas (la contraseña de la base, la `service_role`) las cargás vos en el panel del servicio, nunca las pegás en la conversación.
3. **Un paso por vez, con un commit al final.** Si algo sale mal, volvés al paso anterior.

### Primer pedido: revisar tus conexiones

Abrí Claude Code en la carpeta donde guardás tus proyectos y pegá:

```text
Revisá que todo lo que necesito esté conectado, sin modificar nada:
1. GitHub: gh auth status
2. Vercel: vercel whoami y el conector de Vercel
3. Supabase: el conector de Supabase (listá mis proyectos)
4. Railway: railway whoami y el conector de Railway
Armame una tabla con lo que está bien y lo que falta. Si falta algo,
decime qué módulo del curso tengo que repasar. No corras ningún login:
ese paso lo hago yo.
```

**Cómo sabés que salió bien:** la tabla muestra todo en verde. Railway puede faltar si no vas a hacer el paso 10.

---

## Paso 1 · Tu propia copia

**Qué logra:** el proyecto en tu computadora y en **tu** GitHub, desconectado del repo del demo.

```text
Quiero trabajar sobre mi propia copia del demo de la barbería.
1. Cloná https://github.com/jlucasacosta/sistema-barberia en esta carpeta
2. Preguntame de a una: cómo se llama mi barbería y cómo quiero llamar al repo
3. Sacá el vínculo con el repo original y creá un repo PRIVADO en mi GitHub
4. Subí el proyecto a ese repo
Confirmame con git remote -v que ya no apunta al demo.
```

**Cómo sabés que salió bien:** `origin` apunta a tu usuario. El repo es **privado** porque va a tener datos de clientes reales.

## Paso 2 · Correrlo local

```text
Instalá las dependencias y levantá el proyecto. Si falta Node.js,
instalalo vos. Confirmame que abre en http://localhost:3000.
```

**Cómo sabés que salió bien:** ves el dashboard de Navaja Barbershop. Todavía son datos de ejemplo.

## Paso 3 · Crear tu proyecto de Supabase

**Esto lo hacés vos** (2 minutos):

1. Entrá a <https://database.new> e iniciá sesión con GitHub.
2. Poné el nombre de tu barbería, elegí la región más cercana a tus clientes y generá la contraseña de la base.
3. **Guardá la contraseña en tu gestor de contraseñas.** La vas a necesitar en el paso 10.

Después, en el conector de Supabase, limitá el acceso a **este proyecto** si te lo ofrece. Detalle en [IMPLEMENTAR.md §3.1](IMPLEMENTAR.md).

## Paso 4 · Crear las tablas

**Qué logra:** 10 tablas y 2 vistas, con la seguridad por filas activada y la regla que impide que un barbero tenga dos turnos superpuestos.

```text
Con el conector de Supabase, en mi proyecto de la barbería:
1. Leé docs/sql/01-esquema.sql y resumime en 5 líneas qué va a crear
2. Aplicalo como migración llamada esquema_inicial
3. Listame las tablas y las vistas que quedaron
4. Revisá los Advisors de seguridad y explicame cada aviso
```

**Cómo sabés que salió bien:** hay **10 tablas** (`servicios`, `barberos`, `clientes`, `turnos`, `tickets`, `conversaciones`, `mensajes`, `actividad`, `ajustes`, `notificaciones`) y **2 vistas** (`v_ocupacion_hoy`, `v_ranking_servicios_hoy`), todas con RLS. Puede aparecer un aviso por las políticas de ejemplo (dejan pasar a cualquier usuario autenticado). Es esperado: la base queda cerrada porque solo entran los usuarios que creás vos, y eso lo asegurás en el paso 5 desactivando los registros públicos. Si algún día tenés varios locales, hay que restringirlas (ver [IMPLEMENTAR.md §3.2](IMPLEMENTAR.md)).

**Hacé el commit:** pedile a Claude "Hacé un commit con este paso".

## Paso 5 · Tu usuario y el login

**Esto lo hacés vos en el panel de Supabase:**

1. **Authentication → Users → Add user**: creá tu usuario (email y contraseña).
2. En **Authentication**, desactivá los registros públicos (*Allow new users to sign up*). **Es obligatorio:** las políticas de ejemplo dan acceso total a cualquier usuario autenticado, así que solo pueden entrar las personas que creás vos.

Después pegá:

```text
Agregá el login con Supabase Auth a este proyecto, siguiendo las secciones
3.5 a 3.7 de docs/IMPLEMENTAR.md:
- Instalá @supabase/supabase-js y @supabase/ssr
- Creá lib/supabase/client.ts, lib/supabase/server.ts y middleware.ts
- Creá la pantalla /login (email y contraseña) con el estilo del sistema,
  leyendo todo de shell/theme.ts
- Sacá la URL y la clave publicable de mi proyecto con el conector y
  guardalas en .env.local. No me las pidas por el chat
- No uses Clerk y no uses la service_role en el frontend
Al terminar, levantá el proyecto y mostrame que sin sesión me manda a /login.
```

**Cómo sabés que salió bien:** sin sesión, cualquier pantalla te lleva a `/login`; con tu usuario entrás. Corré `git status`: `.env.local` **no** debe aparecer.

## Paso 6 · Cargar los datos de ejemplo

**Qué logra:** que tu sistema se vea lleno desde el primer minuto, mientras conectás las pantallas.

```text
Con el conector de Supabase, leé docs/sql/02-datos-ejemplo.sql y aplicalo
en mi proyecto de la barbería. Después contame cuántas filas quedaron en
cada tabla.
```

**Cómo sabés que salió bien:** `servicios` 6, `barberos` 4, `clientes` 30, `turnos` 22, `tickets` 25, `conversaciones` 14, `mensajes` 28, `actividad` 12, `ajustes` 4, `notificaciones` 4. Si corrés el archivo dos veces, se frena con un aviso en vez de duplicar. Los turnos y tickets quedan fechados **hoy**: mañana la agenda de "hoy" va a estar vacía, es lo esperado.

## Paso 7 · Conectar las pantallas a la base

**Qué logra:** que cada módulo lea de Supabase en vez de los `data.json`. La regla de oro del sistema: **solo cambia el cuerpo de las funciones de `api.ts`**; el nombre, los parámetros y lo que devuelven quedan igual, así que las pantallas no se tocan.

```text
Conectá los módulos de este sistema a mi Supabase, de a uno, en este orden:
contactos, agenda, ventas, conversaciones, dashboard y config.
Reglas:
- Solo cambiás el cuerpo de las funciones de cada api.ts. Nombre,
  parámetros y tipo de retorno no cambian, y los index.tsx no se tocan
- Mapeá los nombres de la base (snake_case) a los del tipo (camelCase),
  como en la sección 3.8 de docs/IMPLEMENTAR.md
- Si la consulta falla, la función lanza el error: la pantalla ya muestra
  el aviso con "Reintentar"
- Al terminar cada módulo corré npm run build, hacé un commit y frená:
  lo pruebo en el navegador y te digo "seguí"
Empezá por contactos.
```

**Cómo probás cada módulo** (entrando con tu usuario):

| Módulo | Qué tenés que ver |
|---|---|
| Contactos | 30 clientes; al abrir uno, su ficha completa |
| Agenda | 4 columnas de barberos con los 22 turnos de hoy |
| Ventas | 25 tickets del día, con sus estados |
| Conversaciones | 14 hilos; el primero con sus mensajes |
| Dashboard | Ocupación entre 27 % y 41 % por barbero, ranking de servicios y actividad |
| Config | Datos del local y los 4 interruptores de notificaciones |

**Si una lista aparece vacía y sin error:** casi siempre es la seguridad por filas, porque no hay sesión iniciada. Entrá por `/login`. Más casos en [IMPLEMENTAR.md §8](IMPLEMENTAR.md).

## Paso 8 · Que las acciones guarden (opcional, pero es lo que vuelve útil al sistema)

En el demo, "Confirmar" y "Mover silla" (Agenda) y "Cobrar", "Marcar rechazado" y "Reintentar cobro" (Ventas) solo cambian la pantalla. Con backend real, cada una tiene que guardar en la base. Esto **agrega** funciones nuevas a `api.ts` (es lo único que suma, no cambia las existentes). Las demás acciones de las fichas (reprogramar, enviar recordatorio, enviar comprobante, link de pago) quedan como avisos de demostración hasta que las conectes a un proveedor real.

```text
Hacé que estas acciones guarden en Supabase, siguiendo la sección 3.9 de
docs/IMPLEMENTAR.md:
- Agenda: confirmar un turno y mover un turno a otra silla (cambia el barbero)
- Ventas: cobrar un ticket, marcarlo rechazado y reintentar el cobro
Agregá las funciones nuevas en cada api.ts (confirmarTurno, moverTurno,
cobrarTicket, etc.), conectalas a los botones de la ficha y sacá el cartel
"Demo: no se guardó nada" solo de las acciones que ahora sí guardan.
Si mover un turno lo pisa con otro del mismo barbero, mostrá el error de la
base con un mensaje claro en castellano. Frená al terminar para que pruebe.
```

**Cómo sabés que salió bien:** confirmás un turno, apretás F5 y **sigue confirmado**. En el demo, F5 lo deshacía.

## Paso 9 · Publicar en Vercel

```text
Publicá este proyecto en Vercel desde mi repo de GitHub, así cada git push
se publica solo.
- Cargá SOLO NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY, en
  Production y en Preview. La service_role no va en Vercel
- Esperá a que termine el deploy, mostrame el link y confirmame que /login abre
- Si el deploy falla, leé los logs, arreglalo y volvé a desplegar
```

**Esto lo hacés vos:** en Supabase, **Authentication → URL Configuration**, cargá el link de Vercel como *Site URL* y en *Redirect URLs*. Sin eso, el login puede fallar en producción.

**Cómo sabés que salió bien:** entrás al link de Vercel con tu usuario y ves tus datos. Si cambiás una variable `NEXT_PUBLIC_*`, hay que hacer un **Redeploy**. Detalle en [IMPLEMENTAR.md §5](IMPLEMENTAR.md).

> **Plan de Vercel:** Hobby es gratis pero para uso personal. Si el sistema es para una barbería cliente, las condiciones de Vercel piden el plan Pro.

## Paso 10 · Recordatorios automáticos con Railway (opcional)

**Qué logra:** un programa que queda prendido 24/7 y avisa a cada cliente 24 horas antes de su turno. Usa `pg-boss`, una cola que guarda sus tareas en tu **misma** base de Supabase.

**Esto lo hacés vos:** necesitás la **cadena de conexión del pooler en modo sesión** (Supabase → botón **Connect**) con tu contraseña de base. No la pegues en el chat: la vas a cargar vos en Railway.

```text
Armá el worker de recordatorios de turno de la sección 4 de
docs/IMPLEMENTAR.md, en una carpeta aparte y con su propio repo PRIVADO,
y dejalo corriendo en Railway.
- Usá pg-boss. Fijá Node 22.12 o mayor
- Sin dominio público: es un worker, no recibe visitas
- Las claves NO las pegues en el chat ni en ningún archivo: decime qué
  tres variables tengo que cargar yo en el panel de Railway (DATABASE_URL,
  SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY) y esperame
- Cuando las cargue, desplegá y seguí los logs hasta confirmar que arrancó
- El envío de WhatsApp queda simulado: solo escribe en el log
```

**Cómo sabés que salió bien:** en los **Logs** de Railway no hay errores. Para probarlo rápido, pedile a Claude que baje el cron a cada minuto un rato: los turnos de hoy que estén confirmados y todavía no hayan empezado deberían aparecer como `[simulado] WhatsApp a ...`. Después hacé que vuelva a cada 15 minutos.

El envío real por WhatsApp (Meta o Twilio) es un trabajo aparte: el worker trae solo el esqueleto.

## Paso 11 · IA para sugerir respuestas (opcional)

Va en Conversaciones: la IA sugiere una respuesta al cliente y vos decidís si la mandás. Necesitás tu propia clave de OpenAI o Gemini, y tiene costo por uso.

```text
Agregá en Conversaciones un botón "Sugerir respuesta" siguiendo la
sección 6 de docs/IMPLEMENTAR.md.
- La llamada a la IA va SOLO desde el servidor (Route Handler), nunca
  desde el navegador
- Un límite de sugerencias por usuario por minuto
- No mandes teléfonos ni datos personales dentro del prompt
- La clave la cargo yo en las variables de Vercel: decime el nombre
  exacto y esperame
```

## Paso 12 · Antes de cargar datos reales de un cliente

```text
Auditá la seguridad de este proyecto antes de que lo use un cliente real,
siguiendo la sección 7 de docs/IMPLEMENTAR.md:
- Advisors de seguridad de Supabase
- .env.local fuera de git y fuera del historial
- Que la service_role no aparezca en el código del frontend ni en las
  variables de Vercel
- Decime cómo verifico yo que los registros públicos están desactivados
Dame la lista de lo que falla y arreglá lo que se pueda sin pedirme claves.
```

**Cómo sabés que salió bien:** la lista vuelve sin pendientes; el único aviso que puede quedar es el de las políticas de ejemplo (ver paso 4), siempre que los registros públicos estén desactivados. Si tu copia va a tener datos reales de clientes, el repo tiene que ser **privado** (lo dejaste así en el paso 1).

---

## Cuando algo falla

Pegá esto, con el error que ves:

```text
Esto falló en [el paso donde estés]. Revisá los logs con el conector
correspondiente, encontrá la causa, explicámela en una línea, arreglala
y confirmame que quedó andando. Si necesitás algún dato mío, pedímelo
de a uno.
```

Los errores más comunes (lista vacía sin error, `relation does not exist`, `Invalid API key`, volver siempre a `/login`, worker que no conecta) están con su causa y solución en [IMPLEMENTAR.md §8](IMPLEMENTAR.md).

## Qué se verificó y qué no

- **Verificado:** `sql/01-esquema.sql` y `sql/02-datos-ejemplo.sql` se ejecutaron completos en un Postgres embebido (PGlite). Los conteos de la tabla del paso 6 salen de esa corrida, y los datos cargados son idénticos a los del script de la guía (`IMPLEMENTAR.md` §3.4). La segunda corrida de `02` se frena, y un visitante sin sesión ve 0 filas.
- **No verificado:** los pedidos de esta receta **no se corrieron de punta a punta** contra cuentas reales de Supabase, Vercel y Railway. Escribí cada paso para los conectores y las CLI del curso, pero los nombres exactos de botones y avisos de los paneles cambian con el tiempo. El envío real de WhatsApp es un stub.
- Si un paso no te sale, preguntá en el Club de la IA y contá en qué paso quedaste: con eso se corrige la receta para el que viene detrás.

---

## Siguiente paso

Ya tenés el recorrido completo: demo, base de datos, login, publicado, acciones que guardan y tareas automáticas.

**Aprendé a crear tu Agencia de IA y conseguir tu primer cliente.** Eso lo trabajamos adentro del Club de la IA, nuestro Skool privado.

👉 <https://www.skool.com/club-de-la-ia-8047/about>
