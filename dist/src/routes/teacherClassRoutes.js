"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherClassController_js_1 = __importDefault(require("../controllers/teacherClassController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require teacher or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("TEACHER", "ADMIN"));
/**
 * @route GET /teacher/classes
 * @description Get all assigned classes for the teacher (today and all)
 * @access Private - Teacher/Admin
 */
router.get("/", teacherClassController_js_1.default.getMyClasses);
/**
 * @route GET /teacher/classes/schedule/today
 * @description Get today's class schedule
 * @access Private - Teacher/Admin
 */
router.get("/schedule/today", teacherClassController_js_1.default.getTodaySchedule);
/**
 * @route GET /teacher/classes/:classId
 * @description Get detailed information about a specific class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/:classId", teacherClassController_js_1.default.getClassDetails);
/**
 * @route GET /teacher/classes/:classId/statistics
 * @description Get statistics for a specific class (attendance, performance, etc.)
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/:classId/statistics", teacherClassController_js_1.default.getClassStatistics);
exports.default = router;
