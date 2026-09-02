import { Router } from "express";
import { loginHandler, logoutHandler, registerHandler } from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, validate(registerSchema), asyncHandler(registerHandler));
authRouter.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(loginHandler));
authRouter.post("/logout", asyncHandler(logoutHandler));
