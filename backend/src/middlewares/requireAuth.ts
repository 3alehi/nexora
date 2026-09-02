import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../integrations/supabase/client.js";
import { ApiError } from "../utils/ApiError.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; email: string | null };
      accessToken?: string;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized());
  }

  const accessToken = header.slice("Bearer ".length);
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) {
    return next(ApiError.unauthorized("Invalid or expired session"));
  }

  req.user = { id: data.user.id, email: data.user.email ?? null };
  req.accessToken = accessToken;
  next();
}
