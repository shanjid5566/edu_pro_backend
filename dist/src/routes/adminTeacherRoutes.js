"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminTeacherController_1 = __importDefault(require("../controllers/adminTeacherController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all teachers (with pagination, search, filters)
router.get("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.getAllTeachers);
// Export teachers to CSV
router.get("/export/csv", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.exportTeachersToCSV);
// Search teachers
router.get("/search", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.searchTeachers);
// Get all departments
router.get("/departments/list", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.getAllDepartments);
// Get teachers by department
router.get("/department/:department", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.getTeachersByDepartment);
// Get teacher profile by ID
router.get("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.getTeacherById);
// Create new teacher
router.post("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.createTeacher);
// Update teacher
router.put("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.updateTeacher);
// Delete teacher
router.delete("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminTeacherController_1.default.deleteTeacher);
exports.default = router;
