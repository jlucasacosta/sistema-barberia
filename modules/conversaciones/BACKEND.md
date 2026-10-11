# Backend — Conversaciones

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Tablas: `conversaciones` (canal WhatsApp/Instagram, `sin_leer`) y `mensajes` (`de` = cliente | local).
- Ingreso: webhook del canal (Meta) -> Route Handler -> insert en `mensajes` con la service role (solo servidor).
- Realtime: suscribir a `mensajes` para el inbox en vivo.
- Job (pg-boss): reintento de envío fallido.
- Reemplazar: `modules/conversaciones/api.ts` (`getHilos`). Misma firma.
- Carga y errores: `useCarga` con `getHilos`; si falla, aviso con "Reintentar".
- Responder agrega el mensaje al hilo en estado local (no se envía nada). Con backend real: insert en `mensajes` y envío por el canal.
