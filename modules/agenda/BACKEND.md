# Backend — Agenda (turnos)

Guia completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md) (esquema SQL, RLS, ejemplo antes/despues).

- Tablas: `barberos`, `servicios`, `turnos` (`barbero_id`, `servicio_id`, `fecha`, `inicio`, `fin`, `estado`).
- Estados: `pendiente`, `confirmado`, `cancelado`, `no-vino`.
- Un barbero no puede tener dos turnos activos superpuestos: restriccion de exclusion en la base.
- Job (pg-boss en Railway): recordatorio 24 h antes -> WhatsApp/email.
- Reemplazar: `modules/agenda/api.ts` (`getBarberos`, `getTurnos`). Misma firma.
