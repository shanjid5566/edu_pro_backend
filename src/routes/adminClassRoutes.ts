import { Router } from "express";
import adminClassController from "../controllers/adminClassController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Middleware to protect all routes
router.use(verifyToken, checkRole(["ADMIN"]));

// Get all classes
router.get("/", adminClassController.getAllClasses);

// Search classes
router.get("/search", adminClassController.searchClasses);

// Export classes to CSV
router.get("/export/csv", adminClassController.exportClassesToCSV);

// Get class by ID
router.get("/:classId", adminClassController.getClassById);

// Create new class
router.post("/", adminClassController.createClass);

// Update class
router.put("/:classId", adminClassController.updateClass);

// Delete class
router.delete("/:classId", adminClassController.deleteClass);

export default router;
