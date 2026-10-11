# Backend — Ventas

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Tabla: `tickets` (`barbero_id`, `items`, `total`, `metodo`, `fecha`, `hora`, `estado`).
- Estados de cobro: `pendiente`, `cobrado`, `rechazado`. Métodos: Efectivo, Tarjeta, Transferencia, QR.
- Alimenta el dashboard (ranking, actividad). Integración de pago: fuera del alcance del demo.
- Reemplazar: `modules/ventas/api.ts` (`getTickets`). Misma firma.
