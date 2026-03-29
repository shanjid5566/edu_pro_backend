import { Router } from "express";
import adminParentController from "../controllers/adminParentController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Get all parents (with pagination, search, filters)
router.get(
  "/",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.getAllParents
);

// Export parents to CSV
router.get(
  "/export/csv",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.exportParentsToCSV
);

// Search parents
router.get(
  "/search",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.searchParents
);

// Get all occupations
router.get(
  "/occupations/list",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.getAllOccupations
);

// Get parents by occupation
router.get(
  "/occupation/:occupation",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.getParentsByOccupation
);

// Get parent profile by ID
router.get(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.getParentById
);

// Create new parent
router.post(
  "/",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.createParent
);

// Update parent
router.put(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.updateParent
);

// Delete parent
router.delete(
  "/:id",
  verifyToken,
  checkRole(["ADMIN"]),
  adminParentController.deleteParent
);

export default router;
