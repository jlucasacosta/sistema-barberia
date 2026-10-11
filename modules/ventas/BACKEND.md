# Backend — Ventas

Guia completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Tabla: `tickets` (`barbero_id`, `items`, `total`, `metodo`, `fecha`, `hora`, `estado`).
- Estados de cobro: `pendiente`, `cobrado`, `rechazado`. Metodos: Efectivo, Tarjeta, Transferencia, QR.
- Alimenta el dashboard (ranking, actividad). Integracion de pago: fuera del alcance del demo.
- Reemplazar: `modules/ventas/api.ts` (`getTickets`). Misma firma.
