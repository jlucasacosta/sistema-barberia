# Backend — Agenda (turnos)

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md) (esquema SQL, RLS, ejemplo antes/después).

- Tablas: `barberos`, `servicios`, `turnos` (`barbero_id`, `servicio_id`, `fecha`, `inicio`, `fin`, `estado`).
- Estados: `pendiente`, `confirmado`, `cancelado`, `no-vino`.
- Un barbero no puede tener dos turnos activos superpuestos: restricción de exclusión en la base.
- Job (pg-boss en Railway): recordatorio 24 h antes -> WhatsApp/email.
- Reemplazar: `modules/agenda/api.ts` (`getBarberos`, `getTurnos`). Misma firma.
