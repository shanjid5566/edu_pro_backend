/**
 * Teacher Routes
 * API routes for teacher management
 */

import { Router, Request, Response } from "express";
import { teacherController } from "../controllers/teacher.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * @route   GET /api/v1/teachers
 * @access  Private (Admin)
 * @desc    Get all teachers with pagination and filtering
 * @query   page, pageSize, search, department
 */
router.get("/", (req: Request, res: Response) => {
  teacherController.getTeachers(req, res);
});

/**
 * @route   POST /api/v1/teachers
 * @access  Private (Admin)
 * @desc    Create new teacher
 * @body    { name, email, password, phone, department, subjects[], classes[], joinDate, avatar }
 */
router.post("/", (req: Request, res: Response) => {
  teacherController.createTeacher(req, res);
});

/**
 * @route   GET /api/v1/teachers/export
 * @access  Private (Admin)
 * @desc    Export teachers as CSV with filters
 * @query   search, department, status
 */
router.get("/export", (req: Request, res: Response) => {
  teacherController.exportTeachers(req, res);
});

/**
 * @route   GET /api/v1/teachers/:id
 * @access  Private
 * @desc    Get single teacher by ID with statistics
 */
router.get("/:id", (req: Request, res: Response) => {
  teacherController.getTeacherById(req, res);
});

/**
 * @route   GET /api/v1/teachers/:id/stats
 * @access  Private
 * @desc    Get teacher statistics
 */
router.get("/:id/stats", (req: Request, res: Response) => {
  teacherController.getTeacherStats(req, res);
});

/**
 * @route   PUT /api/v1/teachers/:id
 * @access  Private (Admin)
 * @desc    Update teacher information
 * @body    { name, email, phone, department, subjects[], classes[], status, avatar }
 */
router.put("/:id", (req: Request, res: Response) => {
  teacherController.updateTeacher(req, res);
});

/**
 * @route   DELETE /api/v1/teachers/:id
 * @access  Private (Admin)
 * @desc    Delete teacher
 */
router.delete("/:id", (req: Request, res: Response) => {
  teacherController.deleteTeacher(req, res);
});

/**
 * @route   POST /api/v1/teachers/:id/assign-subjects
 * @access  Private (Admin)
 * @desc    Assign subjects to teacher
 * @body    { subjectIds: string[] }
 */
router.post("/:id/assign-subjects", (req: Request, res: Response) => {
  teacherController.assignSubjects(req, res);
});

/**
 * @route   POST /api/v1/teachers/:id/assign-classes
 * @access  Private (Admin)
 * @desc    Assign classes to teacher
 * @body    { classIds: string[] }
 */
router.post("/:id/assign-classes", (req: Request, res: Response) => {
  teacherController.assignClasses(req, res);
});

export default router;
