# Backend — Agenda (turnos)

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md) (esquema SQL, RLS, ejemplo antes/después).

- Tablas: `barberos`, `servicios`, `turnos` (`barbero_id`, `servicio_id`, `fecha`, `inicio`, `fin`, `estado`).
- Estados: `pendiente`, `confirmado`, `cancelado`, `no-vino`.
- Un barbero no puede tener dos turnos activos superpuestos: restricción de exclusión en la base.
- Job (pg-boss en Railway): recordatorio 24 h antes -> WhatsApp/email.
- Reemplazar: `modules/agenda/api.ts` (`getBarberos`, `getTurnos`). Misma firma.
- Carga y errores: la pantalla usa `useCarga`; si `getBarberos`, `getTurnos` o `getClientes` rechazan la promesa se ve el aviso con "Reintentar".
- Cada bloque-turno abre una ficha (`FichaLateral`) con todos los datos del turno y del cliente (de `getClientes()`). Sus acciones (confirmar, mover silla, reprogramar, recordatorio) cambian estado local; con backend real cada una pasa a ser un `update` o un job (ver `docs/IMPLEMENTAR.md`, 3.9).
