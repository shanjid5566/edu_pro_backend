import { Router } from "express";
import adminExamController from "../controllers/adminExamController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Middleware to protect all routes
router.use(verifyToken, checkRole(["ADMIN"]));

// Get all exams
router.get("/", adminExamController.getAllExams);

// Search exams
router.get("/search", adminExamController.searchExams);

// Get exam statistics
router.get("/statistics", adminExamController.getExamStatistics);

// Get exams by status
router.get("/status/:status", adminExamController.getExamsByStatus);

// Get exams by class
router.get("/class/:classId", adminExamController.getExamsByClass);

// Get exam by ID
router.get("/:examId", adminExamController.getExamById);

// Create new exam
router.post("/", adminExamController.createExam);

// Update exam
router.put("/:examId", adminExamController.updateExam);

// Delete exam
router.delete("/:examId", adminExamController.deleteExam);

export default router;
