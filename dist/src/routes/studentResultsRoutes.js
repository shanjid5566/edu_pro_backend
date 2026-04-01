"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentResultsController_js_1 = __importDefault(require("../controllers/studentResultsController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require student or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("STUDENT", "ADMIN"));
/**
 * @route GET /student/results
 * @description Get all exam results
 * @access Private - Student/Admin
 */
router.get("/", studentResultsController_js_1.default.getAllResults);
/**
 * @route GET /student/results/summary
 * @description Get results summary (totals, averages, highs/lows)
 * @access Private - Student/Admin
 */
router.get("/summary", studentResultsController_js_1.default.getResultsSummary);
/**
 * @route GET /student/results/subject-performance
 * @description Get performance breakdown by subject
 * @access Private - Student/Admin
 */
router.get("/subject-performance", studentResultsController_js_1.default.getSubjectPerformance);
/**
 * @route GET /student/results/class-comparison
 * @description Get comparison with class average and ranking
 * @access Private - Student/Admin
 */
router.get("/class-comparison", studentResultsController_js_1.default.getClassComparison);
/**
 * @route GET /student/results/trend
 * @description Get performance trend over time
 * @access Private - Student/Admin
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get("/trend", studentResultsController_js_1.default.getPerformanceTrend);
/**
 * @route GET /student/results/subject/:subjectId
 * @description Get all results for a specific subject
 * @access Private - Student/Admin
 * @param {string} subjectId - Subject ID
 */
router.get("/subject/:subjectId", studentResultsController_js_1.default.getResultsBySubject);
exports.default = router;
