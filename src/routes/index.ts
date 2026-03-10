import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import settingRoutes from "./setting.routes.js";
// import userRoutes from "./user.routes.js";

const router = Router();

// Health routes
router.use("/health", healthRoutes);

// Auth routes
router.use("/auth", authRoutes);

// Settings routes
router.use("/settings", settingRoutes);

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
