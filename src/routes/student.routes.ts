/**
 * Student Routes
 * API routes for student management
 */

import { Router, Request, Response } from "express";
import { studentController } from "../controllers/student.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * @route   GET /api/v1/students
 * @access  Private (Admin)
 * @desc    Get all students with pagination and filtering
 * @query   page, pageSize, search, classId, section
 */
router.get("/", (req: Request, res: Response) => {
  studentController.getStudents(req, res);
});

/**
 * @route   POST /api/v1/students
 * @access  Private (Admin)
 * @desc    Create new student
 * @body    { name, email, password, phone, classId, section, rollNumber, dateOfBirth, gender, address, parentName, parentEmail }
 */
router.post("/", (req: Request, res: Response) => {
  studentController.createStudent(req, res);
});

/**
 * @route   GET /api/v1/students/class/:classId
 * @access  Private
 * @desc    Get students by class
 */
router.get("/class/:classId", (req: Request, res: Response) => {
  studentController.getStudentsByClass(req, res);
});

/**
 * @route   GET /api/v1/students/:id
 * @access  Private
 * @desc    Get single student by ID with statistics
 */
router.get("/:id", (req: Request, res: Response) => {
  studentController.getStudentById(req, res);
});

/**
 * @route   GET /api/v1/students/:id/stats
 * @access  Private
 * @desc    Get student statistics
 */
router.get("/:id/stats", (req: Request, res: Response) => {
  studentController.getStudentStats(req, res);
});

/**
 * @route   PUT /api/v1/students/:id
 * @access  Private (Admin)
 * @desc    Update student information
 * @body    { name, phone, classId, section, rollNumber, dateOfBirth, gender, address, status }
 */
router.put("/:id", (req: Request, res: Response) => {
  studentController.updateStudent(req, res);
});

/**
 * @route   DELETE /api/v1/students/:id
 * @access  Private (Admin)
 * @desc    Delete student
 */
router.delete("/:id", (req: Request, res: Response) => {
  studentController.deleteStudent(req, res);
});

export default router;
