import { Router } from "express";
import { adminSettingsController } from "../controllers/adminSettingsController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// ===============================
// General Settings (Admin only)
// ===============================
router.get("/general", verifyToken, checkRole(["ADMIN"]), (req, res) =>
  adminSettingsController.getGeneralSettings(req, res)
);

router.put("/general", verifyToken, checkRole(["ADMIN"]), (req, res) =>
  adminSettingsController.updateGeneralSettings(req, res)
);

// ===============================
// Profile Settings (All authenticated users)
// ===============================
router.get("/profile", verifyToken, (req, res) =>
  adminSettingsController.getProfileSettings(req, res)
);

router.put("/profile", verifyToken, (req, res) =>
  adminSettingsController.updateProfileSettings(req, res)
);

// ===============================
// Notification Preferences (All authenticated users)
// ===============================
router.get("/notifications", verifyToken, (req, res) =>
  adminSettingsController.getNotificationPreferences(req, res)
);

router.put("/notifications", verifyToken, (req, res) =>
  adminSettingsController.updateNotificationPreferences(req, res)
);

// ===============================
// Security Settings (All authenticated users)
// ===============================
router.put("/security/password", verifyToken, (req, res) =>
  adminSettingsController.updatePassword(req, res)
);

// ===============================
// Appearance/Theme Settings (All authenticated users)
// ===============================
router.get("/preferences", verifyToken, (req, res) =>
  adminSettingsController.getUserPreferences(req, res)
);

router.put("/preferences", verifyToken, (req, res) =>
  adminSettingsController.updateUserPreferences(req, res)
);

export default router;
