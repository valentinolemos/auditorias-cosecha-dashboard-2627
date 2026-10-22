/* Login y perfil del usuario, compartido por index.html y los 3 dashboards.
   Requiere que supabase-client.js ya se haya cargado antes. */

async function obtenerUsuarioActual() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return null;
  const { data: usuario, error } = await supabaseClient
    .from('usuarios')
    .select('nombre, rol, unidad_negocio_id')
    .eq('id', session.user.id)
    .single();
  if (error || !usuario) return { session, usuario: null };
  return { session, usuario };
}

async function iniciarSesionGoogle() {
  await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: { hd: 'admin.com.ar' },
      redirectTo: window.location.origin + window.location.pathname,
    },
  });
}

async function cerrarSesion() {
  await supabaseClient.auth.signOut();
  window.location.reload();
}
