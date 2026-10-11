# Backend — Contactos (clientes)

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Tabla: `clientes` (`barbero_fijo_id`, `servicio_habitual_id`, `fidelidad`, `ultima_visita`, `visitas`, `gasto`).
- `visitas`, `gasto` y `ultima_visita` se pueden recalcular con un job (pg-boss) a partir de `tickets`.
- RLS activado: solo usuarios autenticados.
- Reemplazar: `modules/contactos/api.ts` (`getClientes`). Misma firma.
- Carga y errores: `useCarga` con `getClientes`, `getTurnos` y `getTickets`; si fallan, aviso con "Reintentar".
- Cada fila abre la ficha del cliente con todos sus datos y, derivados, el turno y el cobro de hoy y el gasto por visita. Las acciones (agendar turno, recordatorio, promoción) son de demostración.
