import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import { studentDashboardController } from "../controllers/student-dashboard.controller.js";
const router = Router();
router.use(verifyToken);
router.use(requireRole("STUDENT", "student"));
router.get("/student", (req, res) => {
    studentDashboardController.getStudentDashboard(req, res);
});
router.get("/student/classes", (req, res) => {
    studentDashboardController.getStudentClasses(req, res);
});
router.get("/student/exams", (req, res) => {
    studentDashboardController.getStudentExams(req, res);
});
router.get("/student/results", (req, res) => {
    studentDashboardController.getStudentResults(req, res);
});
router.get("/student/fees", (req, res) => {
    studentDashboardController.getStudentFees(req, res);
});
router.get("/student/notices", (req, res) => {
    studentDashboardController.getStudentNotices(req, res);
});
router.post("/student/notices", (req, res) => {
    studentDashboardController.createStudentNotice(req, res);
});
export default router;
//# sourceMappingURL=student-dashboard.routes.js.map