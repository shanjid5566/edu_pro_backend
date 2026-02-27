import { Router } from "express";
import healthController from "../controllers/health.controller.js";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Get server health status
 *     description: Returns comprehensive health information about the server
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/", healthController.getHealth.bind(healthController));

/**
 * @swagger
 * /health/ping:
 *   get:
 *     tags: [Health]
 *     summary: Simple ping endpoint
 *     description: Returns a simple pong response
 *     responses:
 *       200:
 *         description: Pong
 */
router.get("/ping", healthController.ping.bind(healthController));

export default router;
