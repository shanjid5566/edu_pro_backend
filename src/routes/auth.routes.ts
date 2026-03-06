import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

/**
 * Route: POST /api/v1/auth/login
 * Description: Authenticates a user and returns a JWT token.
 * Access: Public
 */
router.post("/login", AuthController.login);

export default router;
