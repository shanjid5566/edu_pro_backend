"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentClassController_js_1 = __importDefault(require("../controllers/studentClassController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require student or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("STUDENT", "ADMIN"));
/**
 * @route GET /student/classes
 * @description Get all student's classes (subjects, teachers)
 * @access Private - Student/Admin
 */
router.get("/", studentClassController_js_1.default.getMyClasses);
/**
 * @route GET /student/classes/schedule/today
 * @description Get today's class schedule
 * @access Private - Student/Admin
 */
router.get("/schedule/today", studentClassController_js_1.default.getTodayClasses);
/**
 * @route GET /student/classes/schedule
 * @description Get class schedule by day or all days
 * @access Private - Student/Admin
 * @query {string} day - Day name (optional, e.g., Monday, Tuesday)
 */
router.get("/schedule", studentClassController_js_1.default.getClassScheduleByDay);
/**
 * @route GET /student/classes/timetable
 * @description Get weekly timetable
 * @access Private - Student/Admin
 */
router.get("/timetable", studentClassController_js_1.default.getWeeklyTimetable);
/**
 * @route GET /student/classes/subject/:subjectId
 * @description Get subject details with associated teachers and exams
 * @access Private - Student/Admin
 * @param {string} subjectId - Subject ID
 */
router.get("/subject/:subjectId", studentClassController_js_1.default.getSubjectDetails);
exports.default = router;
