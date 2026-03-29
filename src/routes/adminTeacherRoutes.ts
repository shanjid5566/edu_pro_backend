import { Router } from "express";
import adminTeacherController from "../controllers/adminTeacherController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Get all teachers (with pagination, search, filters)
router.get(
  "/",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.getAllTeachers
);

// Export teachers to CSV
router.get(
  "/export/csv",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.exportTeachersToCSV
);

// Search teachers
router.get(
  "/search",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.searchTeachers
);

// Get all departments
router.get(
  "/departments/list",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.getAllDepartments
);

// Get teachers by department
router.get(
  "/department/:department",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.getTeachersByDepartment
);

// Get teacher profile by ID
router.get(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.getTeacherById
);

// Create new teacher
router.post(
  "/",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.createTeacher
);

// Update teacher
router.put(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.updateTeacher
);

// Delete teacher
router.delete(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminTeacherController.deleteTeacher
);

export default router;
