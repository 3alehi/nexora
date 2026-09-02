import { Router } from "express";
import { getByUsername, updateMe } from "../controllers/users.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProfileSchema } from "../validators/auth.validators.js";

export const usersRouter = Router();

usersRouter.get("/:username", asyncHandler(getByUsername));
usersRouter.patch("/me", requireAuth, validate(updateProfileSchema), asyncHandler(updateMe));
