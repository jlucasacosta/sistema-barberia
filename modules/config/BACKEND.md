# Backend — Configuración

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- `modules/config/api.ts`: `getLocal()` y `getNotificaciones()` leen `data.json`. Los barberos se piden con `getBarberos()` de agenda; servicios y horarios salen de `shell/theme.ts`.
- Al conectar el backend: tablas `ajustes` (clave/valor, claves `local.direccion`, `local.telefono`...) y `notificaciones` (`clave`, `label`, `activo`). Misma firma.
- Carga y errores: `useCarga`; si falla, aviso con "Reintentar". Los interruptores de notificaciones cambian estado local; con backend real cada uno es un `update` sobre `notificaciones`.
