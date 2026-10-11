# Backend — Dashboard

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Sin tablas propias de negocio: vistas `v_ocupacion_hoy` y `v_ranking_servicios_hoy` sobre `turnos` y `servicios`, y la tabla `actividad` para el feed.
- Realtime opcional: refrescar al cambiar `turnos` o `tickets`.
- Reemplazar: `modules/dashboard/api.ts` (`getOcupacion`, `getRankingServicios`, `getActividad`). Misma firma.
