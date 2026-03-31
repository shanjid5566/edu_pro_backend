import { Router } from "express";
import authRoutes from "./authRoutes";
import adminDashboardRoutes from "./adminDashboardRoutes";
import adminStudentRoutes from "./adminStudentRoutes";
import adminTeacherRoutes from "./adminTeacherRoutes";
import adminParentRoutes from "./adminParentRoutes";
import adminClassRoutes from "./adminClassRoutes";
import adminClassScheduleRoutes from "./adminClassScheduleRoutes";
import adminExamRoutes from "./adminExamRoutes";
import adminAttendanceRoutes from "./adminAttendanceRoutes";
import adminNoticeRoutes from "./adminNoticeRoutes";
import adminSettingsRoutes from "./adminSettingsRoutes";
import teacherDashboardRoutes from "./teacherDashboardRoutes";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Admin Dashboard routes
router.use("/admin/dashboard", adminDashboardRoutes);

// Admin Student routes
router.use("/admin/students", adminStudentRoutes);

// Admin Teacher routes
router.use("/admin/teachers", adminTeacherRoutes);

// Admin Parent routes
router.use("/admin/parents", adminParentRoutes);

// Admin Class routes
router.use("/admin/classes", adminClassRoutes);

// Admin Class Schedule routes
router.use("/admin/class-schedules", adminClassScheduleRoutes);

// Admin Exam routes
router.use("/admin/exams", adminExamRoutes);

// Admin Attendance routes
router.use("/admin/attendance", adminAttendanceRoutes);

// Admin Notice routes
router.use("/admin/notices", adminNoticeRoutes);

// Admin Settings routes
router.use("/admin/settings", adminSettingsRoutes);

// Teacher Dashboard routes
router.use("/teacher/dashboard", teacherDashboardRoutes);

export default router;
