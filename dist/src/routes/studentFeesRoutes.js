"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentFeesController_js_1 = __importDefault(require("../controllers/studentFeesController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require student or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("STUDENT", "ADMIN"));
/**
 * @route GET /student/fees
 * @description Get all fees with status
 * @access Private - Student/Admin
 */
router.get("/", studentFeesController_js_1.default.getAllFees);
/**
 * @route GET /student/fees/summary
 * @description Get fee summary (total paid, pending, overdue)
 * @access Private - Student/Admin
 */
router.get("/summary", studentFeesController_js_1.default.getFeeSummary);
/**
 * @route GET /student/fees/by-type
 * @description Get fees breakdown by type
 * @access Private - Student/Admin
 */
router.get("/by-type", studentFeesController_js_1.default.getFeesByType);
/**
 * @route GET /student/fees/timeline
 * @description Get paid fees timeline (receipt history)
 * @access Private - Student/Admin
 * @query {number} limit - Number of records to return (default: 10)
 */
router.get("/timeline", studentFeesController_js_1.default.getFeeTimeline);
/**
 * @route GET /student/fees/upcoming
 * @description Get upcoming fees with days remaining
 * @access Private - Student/Admin
 */
router.get("/upcoming", studentFeesController_js_1.default.getUpcomingFees);
/**
 * @route GET /student/fees/overdue
 * @description Get overdue fees with days overdue
 * @access Private - Student/Admin
 */
router.get("/overdue", studentFeesController_js_1.default.getOverdueFees);
/**
 * @route GET /student/fees/status/:status
 * @description Get fees by status (PAID, PENDING, OVERDUE)
 * @access Private - Student/Admin
 * @param {string} status - Fee status
 */
router.get("/status/:status", studentFeesController_js_1.default.getFeesByStatus);
exports.default = router;
