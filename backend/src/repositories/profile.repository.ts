import { supabaseAdmin } from "../integrations/supabase/client.js";
import type { Profile } from "../types/profile.js";

export async function isUsernameTaken(usernameNormalized: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username_normalized", usernameNormalized)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

export async function createProfile(input: {
  id: string;
  username: string;
  email: string;
  displayName?: string;
}): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: input.id,
      username: input.username,
      username_normalized: input.username.toLowerCase(),
      email: input.email,
      display_name: input.displayName ?? input.username,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("username_normalized", username.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin.from("profiles").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export async function updateProfile(
  id: string,
  updates: Partial<Pick<Profile, "display_name" | "bio" | "avatar_url" | "wallet_address">>
): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
