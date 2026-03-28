"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminDashboardController_1 = __importDefault(require("../controllers/adminDashboardController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get complete dashboard
router.get("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminDashboardController_1.default.getDashboard);
// Get overall statistics
router.get("/stats", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminDashboardController_1.default.getStats);
// Get attendance trend
router.get("/attendance-trend", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminDashboardController_1.default.getAttendanceTrend);
// Get performance by subject
router.get("/performance", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminDashboardController_1.default.getPerformance);
// Get today's attendance
router.get("/today-attendance", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminDashboardController_1.default.getTodayAttendance);
// Get recent activity
router.get("/recent-activity", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminDashboardController_1.default.getRecentActivity);
exports.default = router;
