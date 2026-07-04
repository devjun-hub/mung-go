import 'server-only';
import { createClient } from '@supabase/supabase-js';

/** service_role 클라이언트 — RLS 우회, 서버/마이그레이션 전용 */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service credentials not set');
  return createClient(url, key, { auth: { persistSession: false } });
}
