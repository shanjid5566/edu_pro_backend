import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import settingRoutes from "./setting.routes.js";
import noticeRoutes from "./notice.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import examRoutes from "./exam.routes.js";
import classRoutes from "./class.routes.js";
import parentRoutes from "./parent.routes.js";
import teacherRoutes from "./teacher.routes.js";
import studentRoutes from "./student.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
// import userRoutes from "./user.routes.js";
const router = Router();
// Health routes
router.use("/health", healthRoutes);
// Auth routes
router.use("/auth", authRoutes);
// Dashboard routes (must be before other routes for proper routing)
router.use("/dashboard", dashboardRoutes);
// Settings routes
router.use("/settings", settingRoutes);
// Notice board routes
router.use("/notices", noticeRoutes);
// Attendance routes
router.use("/attendance", attendanceRoutes);
// Exams routes
router.use("/exams", examRoutes);
// Classes routes
router.use("/classes", classRoutes);
// Parents routes
router.use("/parents", parentRoutes);
// Teachers routes
router.use("/teachers", teacherRoutes);
// Students routes
router.use("/students", studentRoutes);
// router.use("/users", userRoutes);
// router.use("/subjects", subjectRoutes);
// router.use("/fees", feeRoutes);
// etc...
export default router;
//# sourceMappingURL=index.js.map