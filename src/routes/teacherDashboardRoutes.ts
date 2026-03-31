import { Router } from "express";
import teacherDashboardController from "../controllers/teacherDashboardController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require teacher or admin authentication
router.use(verifyToken, checkRole("TEACHER", "ADMIN"));

/**
 * @route GET /teacher/dashboard/overview
 * @description Get teacher dashboard overview statistics (my classes, total students, classes taken, avg performance)
 * @access Private - Teacher/Admin
 */
router.get("/overview", teacherDashboardController.getDashboardOverview);

/**
 * @route GET /teacher/dashboard/attendance-trend
 * @description Get class attendance trend data
 * @access Private - Teacher/Admin
 * @query {number} months - Number of months to fetch (default: 6)
 */
router.get("/attendance-trend", teacherDashboardController.getAttendanceTrend);

/**
 * @route GET /teacher/dashboard/student-performance
 * @description Get student performance by subject
 * @access Private - Teacher/Admin
 */
router.get(
  "/student-performance",
  teacherDashboardController.getStudentPerformance
);

/**
 * @route GET /teacher/dashboard/my-classes
 * @description Get teacher's classes (today and all)
 * @access Private - Teacher/Admin
 */
router.get("/my-classes", teacherDashboardController.getMyClasses);

/**
 * @route GET /teacher/dashboard/profile
 * @description Get teacher profile information
 * @access Private - Teacher/Admin
 */
router.get("/profile", teacherDashboardController.getTeacherProfile);

export default router;
