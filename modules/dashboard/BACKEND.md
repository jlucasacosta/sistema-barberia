# Backend — Dashboard

Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Sin tablas propias de negocio: vistas `v_ocupacion_hoy` y `v_ranking_servicios_hoy` sobre `turnos` y `servicios`, y la tabla `actividad` para el feed.
- Realtime opcional: refrescar al cambiar `turnos` o `tickets`.
- Reemplazar: `modules/dashboard/api.ts` (`getOcupacion`, `getRankingServicios`, `getActividad`). Misma firma.
- Carga y errores: `useCarga` sobre las cinco funciones (las tres del dashboard más `getBarberos` y `getTurnos` de agenda); si alguna falla, aviso con "Reintentar".
- `pct` de la ocupación = minutos de turnos pendientes o confirmados sobre los 660 min de la jornada (igual que la vista `v_ocupacion_hoy`), y el ranking cuenta esos mismos turnos (igual que `v_ranking_servicios_hoy`).
