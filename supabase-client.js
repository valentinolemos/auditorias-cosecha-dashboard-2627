/* Cliente de Supabase compartido por index.html y los 3 dashboards.
   La URL y la key "publishable" no son secretas -- estan pensadas para
   vivir en el navegador (la seguridad real la da RLS en la base). */
const SUPABASE_URL = 'https://rvdgcvvtwddqzjtchtbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SgA-YpwTeaIRGkPB-cmqjg_E_ItEjf6';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
