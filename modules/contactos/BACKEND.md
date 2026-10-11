# Backend — Contactos (clientes)

Guia completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Tabla: `clientes` (`barbero_fijo_id`, `servicio_habitual_id`, `fidelidad`, `ultima_visita`, `visitas`, `gasto`).
- `visitas`, `gasto` y `ultima_visita` se pueden recalcular con un job (pg-boss) a partir de `tickets`.
- RLS activado: solo usuarios autenticados.
- Reemplazar: `modules/contactos/api.ts` (`getClientes`). Misma firma.
