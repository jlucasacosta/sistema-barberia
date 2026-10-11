// Placeholder de auth (demo: no se usa en ninguna pantalla). Al conectar el backend,
// reemplazar por Supabase Auth con @supabase/ssr. NUNCA Clerk.
// Ver docs/IMPLEMENTAR.md, seccion "Supabase Auth".
export async function getSession() {
  return { user: { id: "demo", name: "Usuario Demo" } }
}
