# Backend — Agenda (turnos)
> Asume BACKEND_RULES.md.

- Tablas: turnos (contacto_id, inicio, fin, servicio, barbero, estado)
- Job (pg-boss): recordatorio 24h y 2h antes -> WhatsApp/email.
- Evitar solapamientos por barbero con constraint de rango horario.
- Reemplazar: modules/agenda/api.ts. Misma firma.
