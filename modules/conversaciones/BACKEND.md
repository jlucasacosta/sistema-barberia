# Backend — Conversaciones

Guia completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Tablas: `conversaciones` (canal WhatsApp/Instagram, `sin_leer`) y `mensajes` (`de` = cliente | local).
- Ingreso: webhook del canal (Meta) -> Route Handler -> insert en `mensajes` con la service role (solo servidor).
- Realtime: suscribir a `mensajes` para el inbox en vivo.
- Job (pg-boss): reintento de envio fallido.
- Reemplazar: `modules/conversaciones/api.ts` (`getHilos`). Misma firma.
