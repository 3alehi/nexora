import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/response.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validators.js";

export async function registerHandler(req: Request, res: Response) {
  const result = await authService.register(req.body as RegisterInput);
  sendSuccess(res, result, 201);
}

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body as LoginInput);
  sendSuccess(res, result);
}

export async function logoutHandler(req: Request, res: Response) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw ApiError.unauthorized();
  }
  await authService.logout(header.slice("Bearer ".length));
  sendSuccess(res, { loggedOut: true });
}
