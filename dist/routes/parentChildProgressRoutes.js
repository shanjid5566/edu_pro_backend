"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parentChildProgressController_js_1 = __importDefault(require("../controllers/parentChildProgressController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require parent or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("PARENT", "ADMIN"));
/**
 * @route GET /parent/child-progress/:studentId/metrics
 * @description Get child's progress metrics (grade, rank, attendance, avg score)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/metrics", parentChildProgressController_js_1.default.getProgressMetrics);
/**
 * @route GET /parent/child-progress/:studentId/timeline
 * @description Get child's progress over time (monthly grades)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get("/:studentId/timeline", parentChildProgressController_js_1.default.getProgressOverTime);
/**
 * @route GET /parent/child-progress/:studentId/subjects
 * @description Get child's subject-wise performance
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/subjects", parentChildProgressController_js_1.default.getSubjectWisePerformance);
/**
 * @route GET /parent/child-progress/:studentId/exam-results
 * @description Get child's exam results with trend analysis
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 10)
 */
router.get("/:studentId/exam-results", parentChildProgressController_js_1.default.getExamResultsWithTrends);
/**
 * @route GET /parent/child-progress/:studentId/summary
 * @description Get child's performance summary and statistics
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/summary", parentChildProgressController_js_1.default.getPerformanceSummary);
exports.default = router;
