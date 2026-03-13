/**
 * Student Routes
 * API routes for student management
 */
import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
const router = Router();
// Apply authentication middleware to all routes
router.use(verifyToken);
/**
 * @route   GET /api/v1/students
 * @access  Private (Admin)
 * @desc    Get all students with pagination and filtering
 * @query   page, pageSize, search, classId, section
 */
router.get("/", requireRole("ADMIN", "admin"), (req, res) => {
    studentController.getStudents(req, res);
});
/**
 * @route   POST /api/v1/students
 * @access  Private (Admin)
 * @desc    Create new student
 * @body    { name, email, password, phone, classId, section, rollNumber, dateOfBirth, gender, address, parentName, parentEmail }
 */
router.post("/", requireRole("ADMIN", "admin"), (req, res) => {
    studentController.createStudent(req, res);
});
/**
 * @route   GET /api/v1/students/export
 * @access  Private (Admin)
 * @desc    Export students as CSV with filters
 * @query   search, classId, className, class, section, status
 */
router.get("/export", requireRole("ADMIN", "admin"), (req, res) => {
    studentController.exportStudents(req, res);
});
/**
 * @route   GET /api/v1/students/class/:classId
 * @access  Private
 * @desc    Get students by class
 */
router.get("/class/:classId", (req, res) => {
    studentController.getStudentsByClass(req, res);
});
/**
 * @route   GET /api/v1/students/:id
 * @access  Private
 * @desc    Get single student by ID with statistics
 */
router.get("/:id", (req, res) => {
    studentController.getStudentById(req, res);
});
/**
 * @route   GET /api/v1/students/:id/stats
 * @access  Private
 * @desc    Get student statistics
 */
router.get("/:id/stats", (req, res) => {
    studentController.getStudentStats(req, res);
});
/**
 * @route   PUT /api/v1/students/:id
 * @access  Private (Admin)
 * @desc    Update student information
 * @body    { name, phone, classId, section, rollNumber, dateOfBirth, gender, address, status }
 */
router.put("/:id", requireRole("ADMIN", "admin"), (req, res) => {
    studentController.updateStudent(req, res);
});
/**
 * @route   DELETE /api/v1/students/:id
 * @access  Private (Admin)
 * @desc    Delete student
 */
router.delete("/:id", requireRole("ADMIN", "admin"), (req, res) => {
    studentController.deleteStudent(req, res);
});
export default router;
//# sourceMappingURL=student.routes.js.map