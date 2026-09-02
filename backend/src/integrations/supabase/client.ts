import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";

/**
 * Service-role client: bypasses RLS. Server-side only, never exposed to the client.
 * Used for admin operations (e.g. username availability checks) and privileged writes.
 */
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Anon-key client: used for Auth flows (sign up / sign in) where Supabase issues the session.
 */
export const supabaseAuth = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Creates a request-scoped client that runs queries as the authenticated user (RLS-enforced),
 * using the user's own access token from the Authorization header.
 */
export function createUserScopedClient(accessToken: string) {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
