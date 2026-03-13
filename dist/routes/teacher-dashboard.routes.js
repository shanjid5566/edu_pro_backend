import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import { teacherDashboardController } from "../controllers/teacher-dashboard.controller.js";
const router = Router();
router.use(verifyToken);
router.use(requireRole("TEACHER", "teacher"));
router.get("/teacher", (req, res) => {
    teacherDashboardController.getTeacherDashboard(req, res);
});
router.get("/teacher/classes", (req, res) => {
    teacherDashboardController.getTeacherClasses(req, res);
});
router.get("/teacher/schedule", (req, res) => {
    teacherDashboardController.getTeacherSchedule(req, res);
});
router.get("/teacher/attendance-sheet", (req, res) => {
    teacherDashboardController.getTeacherAttendanceSheet(req, res);
});
router.post("/teacher/attendance-sheet", (req, res) => {
    teacherDashboardController.saveTeacherAttendanceSheet(req, res);
});
router.get("/teacher/recent-attendance", (req, res) => {
    teacherDashboardController.getTeacherRecentAttendance(req, res);
});
router.get("/teacher/exams", (req, res) => {
    teacherDashboardController.getTeacherExams(req, res);
});
router.post("/teacher/exams", (req, res) => {
    teacherDashboardController.createTeacherExam(req, res);
});
router.post("/teacher/exams/:examId/question-paper", (req, res) => {
    teacherDashboardController.uploadTeacherQuestionPaper(req, res);
});
router.get("/teacher/notices", (req, res) => {
    teacherDashboardController.getTeacherNotices(req, res);
});
router.post("/teacher/notices", (req, res) => {
    teacherDashboardController.createTeacherNotice(req, res);
});
export default router;
//# sourceMappingURL=teacher-dashboard.routes.js.map