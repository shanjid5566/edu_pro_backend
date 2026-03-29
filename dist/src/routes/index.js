"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const adminDashboardRoutes_1 = __importDefault(require("./adminDashboardRoutes"));
const adminStudentRoutes_1 = __importDefault(require("./adminStudentRoutes"));
const adminTeacherRoutes_1 = __importDefault(require("./adminTeacherRoutes"));
const adminParentRoutes_1 = __importDefault(require("./adminParentRoutes"));
const adminClassRoutes_1 = __importDefault(require("./adminClassRoutes"));
const adminClassScheduleRoutes_1 = __importDefault(require("./adminClassScheduleRoutes"));
const router = (0, express_1.Router)();
// Auth routes
router.use("/auth", authRoutes_1.default);
// Admin Dashboard routes
router.use("/admin/dashboard", adminDashboardRoutes_1.default);
// Admin Student routes
router.use("/admin/students", adminStudentRoutes_1.default);
// Admin Teacher routes
router.use("/admin/teachers", adminTeacherRoutes_1.default);
// Admin Parent routes
router.use("/admin/parents", adminParentRoutes_1.default);
// Admin Class routes
router.use("/admin/classes", adminClassRoutes_1.default);
// Admin Class Schedule routes
router.use("/admin/class-schedules", adminClassScheduleRoutes_1.default);
exports.default = router;
