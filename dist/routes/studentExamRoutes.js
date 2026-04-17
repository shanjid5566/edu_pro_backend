"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentExamController_js_1 = __importDefault(require("../controllers/studentExamController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require student or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("STUDENT", "ADMIN"));
/**
 * @route GET /student/exams
 * @description Get all exams (upcoming, ongoing, completed)
 * @access Private - Student/Admin
 */
router.get("/", studentExamController_js_1.default.getMyExams);
/**
 * @route GET /student/exams/upcoming
 * @description Get upcoming exams only
 * @access Private - Student/Admin
 */
router.get("/upcoming", studentExamController_js_1.default.getUpcomingExams);
/**
 * @route GET /student/exams/results
 * @description Get all exam results
 * @access Private - Student/Admin
 */
router.get("/results", studentExamController_js_1.default.getExamResults);
/**
 * @route GET /student/exams/statistics
 * @description Get exam statistics
 * @access Private - Student/Admin
 */
router.get("/statistics", studentExamController_js_1.default.getStatistics);
/**
 * @route GET /student/exams/status/:status
 * @description Get exams by status (UPCOMING, ONGOING, COMPLETED)
 * @access Private - Student/Admin
 * @param {string} status - Exam status
 */
router.get("/status/:status", studentExamController_js_1.default.getExamsByStatus);
/**
 * @route GET /student/exams/:examId
 * @description Get exam details with results
 * @access Private - Student/Admin
 * @param {string} examId - Exam ID
 */
router.get("/:examId", studentExamController_js_1.default.getExamDetails);
exports.default = router;
