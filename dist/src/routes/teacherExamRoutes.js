"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherExamController_js_1 = __importDefault(require("../controllers/teacherExamController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require teacher or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("TEACHER", "ADMIN"));
/**
 * @route GET /teacher/exams
 * @description Get all exams for teacher's classes
 * @access Private - Teacher/Admin
 */
router.get("/", teacherExamController_js_1.default.getMyExams);
/**
 * @route GET /teacher/exams/statistics
 * @description Get exam statistics
 * @access Private - Teacher/Admin
 */
router.get("/statistics", teacherExamController_js_1.default.getStatistics);
/**
 * @route GET /teacher/exams/status/:status
 * @description Get exams by status (UPCOMING, ONGOING, COMPLETED)
 * @access Private - Teacher/Admin
 * @param {string} status - Exam status
 */
router.get("/status/:status", teacherExamController_js_1.default.getExamsByStatus);
/**
 * @route GET /teacher/exams/class/:classId
 * @description Get exams for a specific class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/class/:classId", teacherExamController_js_1.default.getClassExams);
/**
 * @route GET /teacher/exams/:examId
 * @description Get exam details with results
 * @access Private - Teacher/Admin
 * @param {string} examId - Exam ID
 */
router.get("/:examId", teacherExamController_js_1.default.getExamDetails);
/**
 * @route POST /teacher/exams/:examId/marks
 * @description Submit exam marks for students
 * @access Private - Teacher/Admin
 * @param {string} examId - Exam ID
 * @body {Array} marks - Array of {studentId, marksObtained}
 */
router.post("/:examId/marks", teacherExamController_js_1.default.submitMarks);
exports.default = router;
