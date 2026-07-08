# Backend — Conversaciones
> Asume BACKEND_RULES.md.

- Tablas: conversaciones, mensajes
- Ingreso: webhook de WhatsApp (Meta) -> Route Handler -> insert en mensajes
- Realtime: suscribir a mensajes para inbox en vivo
- Job (pg-boss): reintento de envio fallido
- Reemplazar: modules/conversaciones/api.ts. Misma firma.
