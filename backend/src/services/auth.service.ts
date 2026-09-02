import { supabaseAdmin, supabaseAuth } from "../integrations/supabase/client.js";
import * as profileRepository from "../repositories/profile.repository.js";
import { ApiError } from "../utils/ApiError.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validators.js";

export async function register(input: RegisterInput) {
  const usernameNormalized = input.username.toLowerCase();

  const taken = await profileRepository.isUsernameTaken(usernameNormalized);
  if (taken) {
    throw ApiError.conflict("Username is already taken", "USERNAME_TAKEN");
  }

  const { data, error } = await supabaseAuth.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw ApiError.badRequest(error.message, "SIGNUP_FAILED");
  }
  if (!data.user) {
    throw ApiError.internal("Sign up did not return a user");
  }

  const profile = await profileRepository.createProfile({
    id: data.user.id,
    username: input.username,
    email: input.email,
    displayName: input.displayName,
  });

  return { profile, session: data.session };
}

export async function login(input: LoginInput) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.session) {
    throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const profile = await profileRepository.getProfileById(data.user.id);

  return { profile, session: data.session };
}

export async function logout(accessToken: string) {
  const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);
  if (error) {
    throw ApiError.internal("Failed to log out");
  }
}
