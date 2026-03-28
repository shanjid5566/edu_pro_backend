import { Router } from "express";
import adminStudentController from "../controllers/adminStudentController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Get all students (with pagination, search, filters)
router.get(
  "/",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.getAllStudents
);

// Export students to CSV
router.get(
  "/export/csv",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.exportStudentsToCSV
);

// Search students
router.get(
  "/search",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.searchStudents
);

// Get all classes
router.get(
  "/classes/list",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.getAllClasses
);

// Get students by class
router.get(
  "/class/:classId",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.getStudentsByClass
);

// Get student profile by ID
router.get(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.getStudentById
);

// Create new student
router.post(
  "/",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.createStudent
);

// Update student
router.put(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.updateStudent
);

// Delete student
router.delete(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminStudentController.deleteStudent
);

export default router;
