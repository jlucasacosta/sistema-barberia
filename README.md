# Navaja Barbershop — Sistema para barberías

Un sistema de gestión para barberías: turnos, ventas del día, conversaciones con clientes y contactos. Un sistema demo hecho con Next.js.

> Es un demo **frontend** con datos de ejemplo (mock). **No tiene backend conectado**: sirve para ver cómo se ve y cómo funciona un sistema así, y para aprender a construirlo. Todos los datos son inventados; nada se guarda y al recargar la página (F5) vuelve todo al estado original.

---

## Demo en vivo
👉 https://sistema-barberia-three.vercel.app

## Sumate al Club de la IA

Aprendé a crear tu Agencia de IA y conseguir tu primer cliente. Eso lo trabajamos adentro del Club de la IA, nuestro Skool privado.

👉 https://www.skool.com/club-de-la-ia-8047/about

---

## Qué incluye
- Dashboard con métricas del negocio (ocupación por silla, ranking de servicios, actividad)
- Agenda (grilla del día con una columna por barbero; cada turno abre su ficha con detalle y acciones)
- Conversaciones (inbox de clientes)
- Ventas (tablero de cobros del día; cada ticket abre su ficha)
- Contactos (clientes; cada fila abre la ficha con todos sus datos)
- Configuración (datos del local, barberos, servicios, horarios e interruptores de notificaciones)

Todas las pantallas muestran `—` y bloques de carga mientras llegan los datos, y un aviso con "Reintentar" si la carga falla. Las acciones de las fichas son de demostración: dicen "Demo: no se guardó nada" y no persisten.

## Requisitos (instalá esto primero)

Necesitás dos programas gratis en tu computadora:

1. **Node.js** (versión 18 o mayor; recomendamos la LTS actual). Descargalo en https://nodejs.org y elegí la opción **LTS**.
2. **Git**. Descargalo en https://git-scm.com

Para chequear que quedaron instalados, abrí una terminal y escribí:

    node -v
    git --version

Si te devuelven un número de versión, ya está.

## Cómo clonar y correr (paso a paso)

1. Abrí una terminal en la carpeta donde quieras guardar el proyecto.
2. Cloná el repo:

       git clone https://github.com/jlucasacosta/sistema-barberia.git

3. Entrá a la carpeta del proyecto:

       cd sistema-barberia

4. Instalá las dependencias (baja lo que el proyecto necesita):

       npm install

5. Levantá el proyecto:

       npm run dev

6. Abrí el navegador en http://localhost:3000

Listo. Vas a ver el sistema funcionando.

## Personalizarlo

Todo el diseño (colores, tipografía, nombre de la marca, servicios y precios, horario de la agenda) vive en un solo archivo: `shell/theme.ts`. Cambiás eso y muta el sistema entero. Probá y mirá qué pasa.

## Cambiar los datos de ejemplo

Los datos que ves (barberos, turnos, clientes, tickets, conversaciones, datos del local) están en archivos `data.json`, uno por módulo:

    modules/agenda/data.json
    modules/ventas/data.json
    modules/contactos/data.json
    modules/conversaciones/data.json
    modules/dashboard/data.json
    modules/config/data.json

Editá cualquiera de esos archivos y guardá: la pantalla se actualiza. Son de **solo lectura** para la app: si en la pantalla confirmás un turno o cobrás un ticket, el cambio vive solo en la memoria del navegador. Al recargar (F5) vuelve todo a lo que dice el JSON. Esto es a propósito: no hay base de datos ni se guarda nada.

## Estructura de carpetas

    app/            rutas de Next.js (una por pantalla)
    modules/        un módulo por pantalla: index.tsx (UI), api.ts (funciones), data.json (datos)
    shell/          theme.ts (el diseño), navegación, fuentes, helpers de la agenda, carga.tsx (estados de carga y error) y ficha-lateral.tsx (ficha de detalle)
    docs/           IMPLEMENTAR.md: guía para conectarlo a un backend real
    DISENO.md       ficha de diseño: por qué se ve como se ve
    .env.example    nombres de las variables de entorno (vacías)
    LICENSE         licencia MIT

## Llevalo a producción

Este repo es un demo: no incluye backend. Si querés convertirlo en tu sistema real:

1. **Supabase**: base de datos y login (nunca Clerk). Cambiás el cuerpo de las funciones de `api.ts` y la firma queda igual.
2. **Vercel**: publicás el frontend con un `git push`.
3. **Railway + pg-boss**: tareas automáticas, por ejemplo recordatorios de turnos por WhatsApp.
4. **OpenAI o Gemini**: sugerir respuestas en Conversaciones, siempre desde el servidor.

La guía paso a paso, con el SQL de las tablas ya armado para este sistema, está en [`docs/IMPLEMENTAR.md`](docs/IMPLEMENTAR.md). Es una guía que **describe** cómo hacerlo: el repo sigue siendo un demo frontend sin backend conectado.

## Licencia

MIT. Podés usar, copiar y modificar este proyecto libremente. Ver el archivo `LICENSE`.

## Te trabaste

Si algo no te salió, preguntá en el Club de la IA:

👉 https://www.skool.com/club-de-la-ia-8047/about
