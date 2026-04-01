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
const adminExamRoutes_1 = __importDefault(require("./adminExamRoutes"));
const adminAttendanceRoutes_1 = __importDefault(require("./adminAttendanceRoutes"));
const adminNoticeRoutes_1 = __importDefault(require("./adminNoticeRoutes"));
const adminSettingsRoutes_1 = __importDefault(require("./adminSettingsRoutes"));
const teacherDashboardRoutes_1 = __importDefault(require("./teacherDashboardRoutes"));
const teacherClassRoutes_1 = __importDefault(require("./teacherClassRoutes"));
const teacherAttendanceRoutes_1 = __importDefault(require("./teacherAttendanceRoutes"));
const teacherExamRoutes_1 = __importDefault(require("./teacherExamRoutes"));
const teacherNoticeRoutes_1 = __importDefault(require("./teacherNoticeRoutes"));
const studentDashboardRoutes_1 = __importDefault(require("./studentDashboardRoutes"));
const studentClassRoutes_1 = __importDefault(require("./studentClassRoutes"));
const studentExamRoutes_1 = __importDefault(require("./studentExamRoutes"));
const studentResultsRoutes_1 = __importDefault(require("./studentResultsRoutes"));
const studentFeesRoutes_1 = __importDefault(require("./studentFeesRoutes"));
const studentNoticeRoutes_1 = __importDefault(require("./studentNoticeRoutes"));
const parentDashboardRoutes_1 = __importDefault(require("./parentDashboardRoutes"));
const parentChildProgressRoutes_1 = __importDefault(require("./parentChildProgressRoutes"));
const parentChildAttendanceRoutes_1 = __importDefault(require("./parentChildAttendanceRoutes"));
const parentChildFeesRoutes_1 = __importDefault(require("./parentChildFeesRoutes"));
const parentChildNoticesRoutes_1 = __importDefault(require("./parentChildNoticesRoutes"));
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
// Admin Exam routes
router.use("/admin/exams", adminExamRoutes_1.default);
// Admin Attendance routes
router.use("/admin/attendance", adminAttendanceRoutes_1.default);
// Admin Notice routes
router.use("/admin/notices", adminNoticeRoutes_1.default);
// Admin Settings routes
router.use("/admin/settings", adminSettingsRoutes_1.default);
// Teacher Dashboard routes
router.use("/teacher/dashboard", teacherDashboardRoutes_1.default);
// Teacher Class routes
router.use("/teacher/classes", teacherClassRoutes_1.default);
// Teacher Attendance routes
router.use("/teacher/attendance", teacherAttendanceRoutes_1.default);
// Teacher Exam routes
router.use("/teacher/exams", teacherExamRoutes_1.default);
// Teacher Notice routes
router.use("/teacher/notices", teacherNoticeRoutes_1.default);
// Student Dashboard routes
router.use("/student/dashboard", studentDashboardRoutes_1.default);
// Student Class routes
router.use("/student/classes", studentClassRoutes_1.default);
// Student Exam routes
router.use("/student/exams", studentExamRoutes_1.default);
// Student Results routes
router.use("/student/results", studentResultsRoutes_1.default);
// Student Fees routes
router.use("/student/fees", studentFeesRoutes_1.default);
// Student Notice routes
router.use("/student/notices", studentNoticeRoutes_1.default);
// Parent Dashboard routes
router.use("/parent/dashboard", parentDashboardRoutes_1.default);
// Parent Child Progress routes
router.use("/parent/child-progress", parentChildProgressRoutes_1.default);
// Parent Child Attendance routes
router.use("/parent/child-attendance", parentChildAttendanceRoutes_1.default);
// Parent Child Fees routes
router.use("/parent/child-fees", parentChildFeesRoutes_1.default);
// Parent Child Notices routes
router.use("/parent/child-notices", parentChildNoticesRoutes_1.default);
exports.default = router;
