"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const enums_1 = require("../../prisma/generated/prisma/enums");
const router = (0, express_1.Router)();
// All routes require authentication and ADMIN role
router.use(authMiddleware_1.verifyToken);
router.use((0, authMiddleware_1.checkRole)([enums_1.UserRole.ADMIN]));
// Admin Dashboard endpoints
router.get("/dashboard/overview", adminController_1.default.getOverview);
router.get("/dashboard/attendance-trend", adminController_1.default.getAttendanceTrend);
router.get("/dashboard/performance-by-subject", adminController_1.default.getPerformanceBySubject);
router.get("/dashboard/today-attendance", adminController_1.default.getTodayAttendance);
router.get("/dashboard/recent-activity", adminController_1.default.getRecentActivity);
exports.default = router;
