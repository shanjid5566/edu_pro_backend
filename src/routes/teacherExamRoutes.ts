import { Router } from "express";
import teacherExamController from "../controllers/teacherExamController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require teacher or admin authentication
router.use(verifyToken, checkRole("TEACHER", "ADMIN"));

/**
 * @route GET /teacher/exams
 * @description Get all exams for teacher's classes
 * @access Private - Teacher/Admin
 */
router.get("/", teacherExamController.getMyExams);

/**
 * @route GET /teacher/exams/statistics
 * @description Get exam statistics
 * @access Private - Teacher/Admin
 */
router.get("/statistics", teacherExamController.getStatistics);

/**
 * @route GET /teacher/exams/status/:status
 * @description Get exams by status (UPCOMING, ONGOING, COMPLETED)
 * @access Private - Teacher/Admin
 * @param {string} status - Exam status
 */
router.get("/status/:status", teacherExamController.getExamsByStatus);

/**
 * @route GET /teacher/exams/class/:classId
 * @description Get exams for a specific class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/class/:classId", teacherExamController.getClassExams);

/**
 * @route GET /teacher/exams/:examId
 * @description Get exam details with results
 * @access Private - Teacher/Admin
 * @param {string} examId - Exam ID
 */
router.get("/:examId", teacherExamController.getExamDetails);

/**
 * @route POST /teacher/exams/:examId/marks
 * @description Submit exam marks for students
 * @access Private - Teacher/Admin
 * @param {string} examId - Exam ID
 * @body {Array} marks - Array of {studentId, marksObtained}
 */
router.post("/:examId/marks", teacherExamController.submitMarks);

export default router;
