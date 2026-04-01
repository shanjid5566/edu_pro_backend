"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parentChildFeesController_js_1 = __importDefault(require("../controllers/parentChildFeesController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require parent or admin authentication
router.use(authMiddleware_js_1.verifyToken);
router.use((0, authMiddleware_js_1.checkRole)(["PARENT", "ADMIN"]));
/**
 * @route GET /parent/child-fees/:studentId
 * @description Get all fees for child with pagination
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/:studentId", parentChildFeesController_js_1.default.getAllFees);
/**
 * @route GET /parent/child-fees/:studentId/summary
 * @description Get fee summary (total paid, pending, overdue)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/summary", parentChildFeesController_js_1.default.getFeeSummary);
/**
 * @route GET /parent/child-fees/:studentId/by-type
 * @description Get fees breakdown by type
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/by-type", parentChildFeesController_js_1.default.getFeesByType);
/**
 * @route GET /parent/child-fees/:studentId/timeline
 * @description Get paid fees timeline (receipt history)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 10)
 */
router.get("/:studentId/timeline", parentChildFeesController_js_1.default.getFeesTimeline);
/**
 * @route GET /parent/child-fees/:studentId/upcoming
 * @description Get upcoming fees with days remaining
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/upcoming", parentChildFeesController_js_1.default.getUpcomingFees);
/**
 * @route GET /parent/child-fees/:studentId/overdue
 * @description Get overdue fees with days overdue
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/overdue", parentChildFeesController_js_1.default.getOverdueFees);
/**
 * @route GET /parent/child-fees/:studentId/:status
 * @description Get fees by status (PAID, UNPAID, PARTIAL)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @param {string} status - Fee status
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/:studentId/:status", parentChildFeesController_js_1.default.getFeesByStatus);
exports.default = router;
