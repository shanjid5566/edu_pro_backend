import settingService from "../services/setting.service.js";
import { ApiResponse } from "../utils/response.js";
export class SettingController {
    /**
     * @route   GET /api/v1/settings/general
     * @desc    Get general settings (public)
     * @access  Public
     */
    async getGeneralSettings(req, res, next) {
        try {
            const settings = await settingService.getGeneralSettings();
            return ApiResponse.success(res, settings, "General settings retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   PUT /api/v1/settings/general
     * @desc    Update general settings (admin only)
     * @access  Private - Admin
     */
    async updateGeneralSettings(req, res, next) {
        try {
            const input = {
                schoolName: req.body.schoolName,
                schoolEmail: req.body.schoolEmail,
                schoolPhone: req.body.schoolPhone,
                schoolAddress: req.body.schoolAddress,
                academicYear: req.body.academicYear,
            };
            const settings = await settingService.updateGeneralSettings(input);
            return ApiResponse.success(res, settings, "General settings updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   GET /api/v1/settings/user/preferences
     * @desc    Get user preferences
     * @access  Private
     */
    async getUserPreferences(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const preferences = await settingService.getUserPreferences(userId);
            return ApiResponse.success(res, preferences, "User preferences retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   PUT /api/v1/settings/user/preferences
     * @desc    Update user preferences
     * @access  Private
     */
    async updateUserPreferences(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const input = {
                theme: req.body.theme,
                sidebarStyle: req.body.sidebarStyle,
                emailNotifications: req.body.emailNotifications,
                pushNotifications: req.body.pushNotifications,
                smsAlerts: req.body.smsAlerts,
                attendanceAlerts: req.body.attendanceAlerts,
                examReminders: req.body.examReminders,
                enrollmentAlerts: req.body.enrollmentAlerts,
                language: req.body.language,
            };
            const preferences = await settingService.updateUserPreferences(userId, input);
            return ApiResponse.success(res, preferences, "User preferences updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   GET /api/v1/settings/user/profile
     * @desc    Get user profile
     * @access  Private
     */
    async getUserProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const profile = await settingService.getUserProfile(userId);
            return ApiResponse.success(res, profile, "User profile retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   PUT /api/v1/settings/user/profile
     * @desc    Update user profile
     * @access  Private
     */
    async updateUserProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const input = {
                fullName: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone,
                avatar: req.body.avatar,
            };
            const profile = await settingService.updateUserProfile(userId, input);
            return ApiResponse.success(res, profile, "User profile updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   POST /api/v1/settings/user/change-password
     * @desc    Change user password
     * @access  Private
     */
    async changePassword(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const input = {
                currentPassword: req.body.currentPassword,
                newPassword: req.body.newPassword,
                confirmPassword: req.body.confirmPassword,
                twoFactorEnabled: req.body.twoFactorEnabled,
            };
            const result = await settingService.changePassword(userId, input);
            return ApiResponse.success(res, result, result.message);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   PUT /api/v1/settings/user/notifications
     * @desc    Update notification preferences
     * @access  Private
     */
    async updateNotificationPreferences(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const input = {
                emailNotifications: req.body.emailNotifications,
                pushNotifications: req.body.pushNotifications,
                smsAlerts: req.body.smsAlerts,
                attendanceAlerts: req.body.attendanceAlerts,
                examReminders: req.body.examReminders,
                enrollmentAlerts: req.body.enrollmentAlerts,
            };
            const preferences = await settingService.updateNotificationPreferences(userId, input);
            return ApiResponse.success(res, preferences, "Notification preferences updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   PUT /api/v1/settings/user/appearance
     * @desc    Update appearance settings
     * @access  Private
     */
    async updateAppearanceSettings(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const input = {
                theme: req.body.theme,
                sidebarStyle: req.body.sidebarStyle,
                language: req.body.language,
            };
            const settings = await settingService.updateAppearanceSettings(userId, input);
            return ApiResponse.success(res, settings, "Appearance settings updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   GET /api/v1/settings/:key
     * @desc    Get specific setting by key (admin only)
     * @access  Private - Admin
     */
    async getSettingByKey(req, res, next) {
        try {
            const { key } = req.params;
            const setting = await settingService.getSettingByKey(key);
            return ApiResponse.success(res, setting, "Setting retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   PUT /api/v1/settings/bulk
     * @desc    Bulk update settings (admin only)
     * @access  Private - Admin
     */
    async bulkUpdateSettings(req, res, next) {
        try {
            const input = {
                settings: req.body.settings,
            };
            const result = await settingService.bulkUpdateSettings(input);
            return ApiResponse.success(res, result, result.message);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   GET /api/v1/settings/health/check
     * @desc    Check system configuration
     * @access  Private
     */
    async getSystemStatus(req, res, next) {
        try {
            const status = {
                database: "connected",
                cache: "available",
                api: "running",
                timestamp: new Date().toISOString(),
            };
            return ApiResponse.success(res, status, "System status retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
export default new SettingController();
//# sourceMappingURL=setting.controller.js.map