import { Router } from "express";
import studentClassController from "../controllers/studentClassController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require student or admin authentication
router.use(verifyToken, checkRole("STUDENT", "ADMIN"));

/**
 * @route GET /student/classes
 * @description Get all student's classes (subjects, teachers)
 * @access Private - Student/Admin
 */
router.get("/", studentClassController.getMyClasses);

/**
 * @route GET /student/classes/schedule/today
 * @description Get today's class schedule
 * @access Private - Student/Admin
 */
router.get("/schedule/today", studentClassController.getTodayClasses);

/**
 * @route GET /student/classes/schedule
 * @description Get class schedule by day or all days
 * @access Private - Student/Admin
 * @query {string} day - Day name (optional, e.g., Monday, Tuesday)
 */
router.get("/schedule", studentClassController.getClassScheduleByDay);

/**
 * @route GET /student/classes/timetable
 * @description Get weekly timetable
 * @access Private - Student/Admin
 */
router.get("/timetable", studentClassController.getWeeklyTimetable);

/**
 * @route GET /student/classes/subject/:subjectId
 * @description Get subject details with associated teachers and exams
 * @access Private - Student/Admin
 * @param {string} subjectId - Subject ID
 */
router.get("/subject/:subjectId", studentClassController.getSubjectDetails);

export default router;
