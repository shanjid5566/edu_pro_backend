"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminExamController_1 = __importDefault(require("../controllers/adminExamController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Middleware to protect all routes
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]));
// Get all exams
router.get("/", adminExamController_1.default.getAllExams);
// Search exams
router.get("/search", adminExamController_1.default.searchExams);
// Get exam statistics
router.get("/statistics", adminExamController_1.default.getExamStatistics);
// Get exams by status
router.get("/status/:status", adminExamController_1.default.getExamsByStatus);
// Get exams by class
router.get("/class/:classId", adminExamController_1.default.getExamsByClass);
// Get exam by ID
router.get("/:examId", adminExamController_1.default.getExamById);
// Create new exam
router.post("/", adminExamController_1.default.createExam);
// Update exam
router.put("/:examId", adminExamController_1.default.updateExam);
// Delete exam
router.delete("/:examId", adminExamController_1.default.deleteExam);
exports.default = router;
