import { Router } from "express";
import studentExamController from "../controllers/studentExamController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require student or admin authentication
router.use(verifyToken, checkRole("STUDENT", "ADMIN"));

/**
 * @route GET /student/exams
 * @description Get all exams (upcoming, ongoing, completed)
 * @access Private - Student/Admin
 */
router.get("/", studentExamController.getMyExams);

/**
 * @route GET /student/exams/upcoming
 * @description Get upcoming exams only
 * @access Private - Student/Admin
 */
router.get("/upcoming", studentExamController.getUpcomingExams);

/**
 * @route GET /student/exams/results
 * @description Get all exam results
 * @access Private - Student/Admin
 */
router.get("/results", studentExamController.getExamResults);

/**
 * @route GET /student/exams/statistics
 * @description Get exam statistics
 * @access Private - Student/Admin
 */
router.get("/statistics", studentExamController.getStatistics);

/**
 * @route GET /student/exams/status/:status
 * @description Get exams by status (UPCOMING, ONGOING, COMPLETED)
 * @access Private - Student/Admin
 * @param {string} status - Exam status
 */
router.get("/status/:status", studentExamController.getExamsByStatus);

/**
 * @route GET /student/exams/:examId
 * @description Get exam details with results
 * @access Private - Student/Admin
 * @param {string} examId - Exam ID
 */
router.get("/:examId", studentExamController.getExamDetails);

export default router;
