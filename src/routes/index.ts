import { Router } from "express";
import exampleController from "../controllers/exampleController";
import authRoutes from "./authRoutes";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

export default router;
