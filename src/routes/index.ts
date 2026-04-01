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
import teacherClassRoutes from "./teacherClassRoutes";
import teacherAttendanceRoutes from "./teacherAttendanceRoutes";
import teacherExamRoutes from "./teacherExamRoutes";
import teacherNoticeRoutes from "./teacherNoticeRoutes";
import studentDashboardRoutes from "./studentDashboardRoutes";
import studentClassRoutes from "./studentClassRoutes";
import studentExamRoutes from "./studentExamRoutes";
import studentResultsRoutes from "./studentResultsRoutes";
import studentFeesRoutes from "./studentFeesRoutes";
import studentNoticeRoutes from "./studentNoticeRoutes";
import parentDashboardRoutes from "./parentDashboardRoutes";
import parentChildProgressRoutes from "./parentChildProgressRoutes";
import parentChildAttendanceRoutes from "./parentChildAttendanceRoutes";
import parentChildFeesRoutes from "./parentChildFeesRoutes";
import parentChildNoticesRoutes from "./parentChildNoticesRoutes";

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

// Teacher Class routes
router.use("/teacher/classes", teacherClassRoutes);

// Teacher Attendance routes
router.use("/teacher/attendance", teacherAttendanceRoutes);

// Teacher Exam routes
router.use("/teacher/exams", teacherExamRoutes);

// Teacher Notice routes
router.use("/teacher/notices", teacherNoticeRoutes);

// Student Dashboard routes
router.use("/student/dashboard", studentDashboardRoutes);

// Student Class routes
router.use("/student/classes", studentClassRoutes);

// Student Exam routes
router.use("/student/exams", studentExamRoutes);

// Student Results routes
router.use("/student/results", studentResultsRoutes);

// Student Fees routes
router.use("/student/fees", studentFeesRoutes);

// Student Notice routes
router.use("/student/notices", studentNoticeRoutes);

// Parent Dashboard routes
router.use("/parent/dashboard", parentDashboardRoutes);

// Parent Child Progress routes
router.use("/parent/child-progress", parentChildProgressRoutes);

// Parent Child Attendance routes
router.use("/parent/child-attendance", parentChildAttendanceRoutes);

// Parent Child Fees routes
router.use("/parent/child-fees", parentChildFeesRoutes);

// Parent Child Notices routes
router.use("/parent/child-notices", parentChildNoticesRoutes);

export default router;
