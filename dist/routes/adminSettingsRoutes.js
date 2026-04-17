"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminSettingsController_js_1 = require("../controllers/adminSettingsController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// ===============================
// General Settings (Admin only)
// ===============================
router.get("/general", authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)(["ADMIN"]), (req, res) => adminSettingsController_js_1.adminSettingsController.getGeneralSettings(req, res));
router.put("/general", authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)(["ADMIN"]), (req, res) => adminSettingsController_js_1.adminSettingsController.updateGeneralSettings(req, res));
// ===============================
// Profile Settings (All authenticated users)
// ===============================
router.get("/profile", authMiddleware_js_1.verifyToken, (req, res) => adminSettingsController_js_1.adminSettingsController.getProfileSettings(req, res));
router.put("/profile", authMiddleware_js_1.verifyToken, (req, res) => adminSettingsController_js_1.adminSettingsController.updateProfileSettings(req, res));
// ===============================
// Notification Preferences (All authenticated users)
// ===============================
router.get("/notifications", authMiddleware_js_1.verifyToken, (req, res) => adminSettingsController_js_1.adminSettingsController.getNotificationPreferences(req, res));
router.put("/notifications", authMiddleware_js_1.verifyToken, (req, res) => adminSettingsController_js_1.adminSettingsController.updateNotificationPreferences(req, res));
// ===============================
// Security Settings (All authenticated users)
// ===============================
router.put("/security/password", authMiddleware_js_1.verifyToken, (req, res) => adminSettingsController_js_1.adminSettingsController.updatePassword(req, res));
// ===============================
// Appearance/Theme Settings (All authenticated users)
// ===============================
router.get("/preferences", authMiddleware_js_1.verifyToken, (req, res) => adminSettingsController_js_1.adminSettingsController.getUserPreferences(req, res));
router.put("/preferences", authMiddleware_js_1.verifyToken, (req, res) => adminSettingsController_js_1.adminSettingsController.updateUserPreferences(req, res));
exports.default = router;
