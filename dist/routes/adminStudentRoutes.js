"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminStudentController_1 = __importDefault(require("../controllers/adminStudentController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all students (with pagination, search, filters)
router.get("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.getAllStudents);
// Export students to CSV
router.get("/export/csv", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.exportStudentsToCSV);
// Search students
router.get("/search", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.searchStudents);
// Get all classes
router.get("/classes/list", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.getAllClasses);
// Get students by class
router.get("/class/:classId", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.getStudentsByClass);
// Get student profile by ID
router.get("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.getStudentById);
// Create new student
router.post("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.createStudent);
// Update student
router.put("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.updateStudent);
// Delete student
router.delete("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminStudentController_1.default.deleteStudent);
exports.default = router;
