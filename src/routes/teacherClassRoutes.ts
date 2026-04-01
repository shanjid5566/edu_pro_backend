import { Router } from "express";
import teacherClassController from "../controllers/teacherClassController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require teacher or admin authentication
router.use(verifyToken, checkRole("TEACHER", "ADMIN"));

/**
 * @route GET /teacher/classes
 * @description Get all assigned classes for the teacher (today and all)
 * @access Private - Teacher/Admin
 */
router.get("/", teacherClassController.getMyClasses);

/**
 * @route GET /teacher/classes/schedule/today
 * @description Get today's class schedule
 * @access Private - Teacher/Admin
 */
router.get("/schedule/today", teacherClassController.getTodaySchedule);

/**
 * @route GET /teacher/classes/:classId
 * @description Get detailed information about a specific class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/:classId", teacherClassController.getClassDetails);

/**
 * @route GET /teacher/classes/:classId/statistics
 * @description Get statistics for a specific class (attendance, performance, etc.)
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/:classId/statistics", teacherClassController.getClassStatistics);

export default router;
