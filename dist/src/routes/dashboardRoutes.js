"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = __importDefault(require("../controllers/dashboardController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const enums_1 = require("../../prisma/generated/prisma/enums");
const router = (0, express_1.Router)();
// All routes require authentication and ADMIN role
router.use(authMiddleware_1.verifyToken);
router.use((0, authMiddleware_1.checkRole)([enums_1.UserRole.ADMIN]));
// Dashboard endpoints
router.get("/overview", dashboardController_1.default.getOverview);
router.get("/attendance-trend", dashboardController_1.default.getAttendanceTrend);
router.get("/performance-by-subject", dashboardController_1.default.getPerformanceBySubject);
router.get("/today-attendance", dashboardController_1.default.getTodayAttendance);
router.get("/recent-activity", dashboardController_1.default.getRecentActivity);
router.get("/", dashboardController_1.default.getDashboard);
exports.default = router;
