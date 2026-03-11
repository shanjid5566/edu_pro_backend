import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import settingRoutes from "./setting.routes.js";
import noticeRoutes from "./notice.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import examRoutes from "./exam.routes.js";
import classRoutes from "./class.routes.js";
import parentRoutes from "./parent.routes.js";
// import userRoutes from "./user.routes.js";

const router = Router();

// Health routes
router.use("/health", healthRoutes);

// Auth routes
router.use("/auth", authRoutes);

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

// router.use("/users", userRoutes);
// router.use("/students", studentRoutes);
// router.use("/teachers", teacherRoutes);
// router.use("/classes", classRoutes);
// router.use("/subjects", subjectRoutes);
// router.use("/attendance", attendanceRoutes);
// router.use("/exams", examRoutes);
// router.use("/fees", feeRoutes);
// etc...

export default router;
