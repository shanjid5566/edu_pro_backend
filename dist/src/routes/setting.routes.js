import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import settingController from "../controllers/setting.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
const router = Router();
/**
 * Validation middleware to handle errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};
// ========================
// General Settings (Public)
// ========================
/**
 * @swagger
 * /api/v1/settings/general:
 *   get:
 *     tags: [Settings]
 *     summary: Get general school settings
 *     description: Retrieve general settings like school name, email, phone, and address
 *     responses:
 *       200:
 *         description: General settings retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/general", settingController.getGeneralSettings.bind(settingController));
/**
 * @swagger
 * /api/v1/settings/general:
 *   put:
 *     tags: [Settings]
 *     summary: Update general settings
 *     description: Update school information (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName:
 *                 type: string
 *                 example: "EduPro Academy"
 *               schoolEmail:
 *                 type: string
 *                 example: "admin@edupro.com"
 *               schoolPhone:
 *                 type: string
 *                 example: "+1234567890"
 *               schoolAddress:
 *                 type: string
 *                 example: "123 Education Blvd"
 *               academicYear:
 *                 type: string
 *                 example: "2025-2026"
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.put("/general", verifyToken, requireRole("ADMIN"), [
    body("schoolName")
        .trim()
        .notEmpty()
        .withMessage("School name is required")
        .isLength({ min: 3 })
        .withMessage("School name must be at least 3 characters"),
    body("schoolEmail")
        .isEmail()
        .withMessage("Invalid email format"),
    body("schoolPhone")
        .notEmpty()
        .withMessage("Phone is required"),
    body("schoolAddress")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),
    body("academicYear")
        .trim()
        .notEmpty()
        .withMessage("Academic year is required"),
], handleValidationErrors, settingController.updateGeneralSettings.bind(settingController));
// ========================
// User Preferences
// ========================
/**
 * @swagger
 * /api/v1/settings/user/preferences:
 *   get:
 *     tags: [Settings]
 *     summary: Get user preferences
 *     description: Retrieve user preferences (theme, sidebar, notifications)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/user/preferences", verifyToken, settingController.getUserPreferences.bind(settingController));
/**
 * @swagger
 * /api/v1/settings/user/preferences:
 *   put:
 *     tags: [Settings]
 *     summary: Update user preferences
 *     description: Update theme, sidebar style, and notification preferences
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [LIGHT, DARK, SYSTEM]
 *               sidebarStyle:
 *                 type: string
 *                 enum: [COMPACT, EXPANDED]
 *               emailNotifications:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/user/preferences", verifyToken, [
    body("theme")
        .optional()
        .isIn(["LIGHT", "DARK", "SYSTEM"])
        .withMessage("Invalid theme"),
    body("sidebarStyle")
        .optional()
        .isIn(["COMPACT", "EXPANDED"])
        .withMessage("Invalid sidebar style"),
    body("emailNotifications").optional().isBoolean(),
    body("pushNotifications").optional().isBoolean(),
    body("language").optional().isLength({ min: 2, max: 5 }),
], handleValidationErrors, settingController.updateUserPreferences.bind(settingController));
// ========================
// User Profile
// ========================
/**
 * @swagger
 * /api/v1/settings/user/profile:
 *   get:
 *     tags: [Settings]
 *     summary: Get user profile
 *     description: Retrieve current user profile information
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/user/profile", verifyToken, settingController.getUserProfile.bind(settingController));
/**
 * @swagger
 * /api/v1/settings/user/profile:
 *   put:
 *     tags: [Settings]
 *     summary: Update user profile
 *     description: Update user name, email, phone, and avatar
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/user/profile", verifyToken, [
    body("fullName")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email format"),
    body("phone").optional().trim(),
    body("avatar").optional().isURL().withMessage("Invalid URL for avatar"),
], handleValidationErrors, settingController.updateUserProfile.bind(settingController));
// ========================
// Security Settings
// ========================
/**
 * @swagger
 * /api/v1/settings/user/change-password:
 *   post:
 *     tags: [Settings]
 *     summary: Change user password
 *     description: Update user password with validation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post("/user/change-password", verifyToken, [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Password confirmation is required"),
], handleValidationErrors, settingController.changePassword.bind(settingController));
// ========================
// Notification Settings
// ========================
/**
 * @swagger
 * /api/v1/settings/user/notifications:
 *   put:
 *     tags: [Settings]
 *     summary: Update notification preferences
 *     description: Configure email, push, SMS, and alert notifications
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *               smsAlerts:
 *                 type: boolean
 *               attendanceAlerts:
 *                 type: boolean
 *               examReminders:
 *                 type: boolean
 *               enrollmentAlerts:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/user/notifications", verifyToken, [
    body("emailNotifications").optional().isBoolean(),
    body("pushNotifications").optional().isBoolean(),
    body("smsAlerts").optional().isBoolean(),
    body("attendanceAlerts").optional().isBoolean(),
    body("examReminders").optional().isBoolean(),
    body("enrollmentAlerts").optional().isBoolean(),
], handleValidationErrors, settingController.updateNotificationPreferences.bind(settingController));
// ========================
// Appearance Settings
// ========================
/**
 * @swagger
 * /api/v1/settings/user/appearance:
 *   put:
 *     tags: [Settings]
 *     summary: Update appearance settings
 *     description: Update theme, sidebar style, and language preferences
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *               - sidebarStyle
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [LIGHT, DARK, SYSTEM]
 *               sidebarStyle:
 *                 type: string
 *                 enum: [COMPACT, EXPANDED]
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appearance settings updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/user/appearance", verifyToken, [
    body("theme")
        .isIn(["LIGHT", "DARK", "SYSTEM"])
        .withMessage("Invalid theme"),
    body("sidebarStyle")
        .isIn(["COMPACT", "EXPANDED"])
        .withMessage("Invalid sidebar style"),
    body("language").optional().isLength({ min: 2, max: 5 }),
], handleValidationErrors, settingController.updateAppearanceSettings.bind(settingController));
// ========================
// Admin Settings
// ========================
/**
 * @swagger
 * /api/v1/settings/{key}:
 *   get:
 *     tags: [Settings]
 *     summary: Get setting by key (Admin)
 *     description: Retrieve a specific setting value by key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Setting not found
 */
router.get("/:key", verifyToken, requireRole("ADMIN"), [param("key").trim().notEmpty()], handleValidationErrors, settingController.getSettingByKey.bind(settingController));
/**
 * @swagger
 * /api/v1/settings/bulk:
 *   put:
 *     tags: [Settings]
 *     summary: Bulk update settings (Admin)
 *     description: Update multiple settings at once
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - settings
 *             properties:
 *               settings:
 *                 type: object
 *                 example:
 *                   schoolName: "EduPro Academy"
 *                   schoolEmail: "admin@edupro.com"
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/bulk", verifyToken, requireRole("ADMIN"), [body("settings").isObject().withMessage("Settings must be an object")], handleValidationErrors, settingController.bulkUpdateSettings.bind(settingController));
// ========================
// System Health Check
// ========================
/**
 * @swagger
 * /api/v1/settings/health/check:
 *   get:
 *     tags: [Settings]
 *     summary: System health status
 *     description: Check system configuration and status
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System status retrieved successfully
 */
router.get("/health/check", verifyToken, settingController.getSystemStatus.bind(settingController));
export default router;
//# sourceMappingURL=setting.routes.js.map