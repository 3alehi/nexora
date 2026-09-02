import type { Request, Response } from "express";
import * as profileRepository from "../repositories/profile.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/response.js";
import type { UpdateProfileInput } from "../validators/auth.validators.js";

export async function getByUsername(req: Request, res: Response) {
  const profile = await profileRepository.getProfileByUsername(req.params.username);
  if (!profile) {
    throw ApiError.notFound("User not found");
  }
  sendSuccess(res, profile);
}

export async function updateMe(req: Request, res: Response) {
  const updates = req.body as UpdateProfileInput;
  const profile = await profileRepository.updateProfile(req.user!.id, {
    display_name: updates.displayName,
    bio: updates.bio,
    avatar_url: updates.avatarUrl,
    wallet_address: updates.walletAddress,
  });
  sendSuccess(res, profile);
}
