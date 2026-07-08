# Backend — Dashboard
> Asume BACKEND_RULES.md (stack global). Aca solo lo propio.

- Sin tablas propias: agrega datos de otros modulos (ventas, pipeline, conversaciones).
- Fuente ideal: vistas / materialized views en Supabase.
- Realtime opcional: refrescar KPIs suscribiendo a las tablas fuente.
- Reemplazar: modules/dashboard/api.ts (mock -> queries agregadas). Misma firma.
