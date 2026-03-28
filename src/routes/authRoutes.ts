import { Router } from "express";
import authController from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/login", authController.login);

// Protected routes
router.get("/profile", verifyToken, authController.getProfile);

export default router;
