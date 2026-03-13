import { db } from "../config/database.config.js";
import { BadRequestError, ValidationError } from "../utils/errors.js";
import bcryptjs from "bcryptjs";
export class SettingService {
    /**
     * Get all general settings
     */
    async getGeneralSettings() {
        try {
            const settings = await db.setting.findMany();
            const generalSettings = {
                schoolName: this.getSettingValue(settings, "schoolName", "EduPro Academy"),
                schoolEmail: this.getSettingValue(settings, "schoolEmail", "admin@edupro.com"),
                schoolPhone: this.getSettingValue(settings, "schoolPhone", "+1234567890"),
                schoolAddress: this.getSettingValue(settings, "schoolAddress", "123 Education Blvd, Learning City"),
                academicYear: this.getSettingValue(settings, "academicYear", "2025-2026"),
            };
            return generalSettings;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update general settings (admin only)
     */
    async updateGeneralSettings(input) {
        try {
            // Validate inputs
            if (!input.schoolName?.trim()) {
                throw new ValidationError("School name is required");
            }
            if (!input.schoolEmail?.trim()) {
                throw new ValidationError("School email is required");
            }
            if (!input.schoolPhone?.trim()) {
                throw new ValidationError("School phone is required");
            }
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.schoolEmail)) {
                throw new ValidationError("Invalid email format");
            }
            const updates = [
                { key: "schoolName", value: input.schoolName },
                { key: "schoolEmail", value: input.schoolEmail },
                { key: "schoolPhone", value: input.schoolPhone },
                { key: "schoolAddress", value: input.schoolAddress },
                { key: "academicYear", value: input.academicYear },
            ];
            // Upsert each setting
            for (const update of updates) {
                await db.setting.upsert({
                    where: { key: update.key },
                    update: { value: update.value },
                    create: { key: update.key, value: update.value },
                });
            }
            return {
                ...input,
                updatedAt: new Date(),
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get user preferences
     */
    async getUserPreferences(userId) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new BadRequestError("User not found");
            }
            // Get settings from metadata or return defaults
            const preferences = {
                userId,
                theme: "LIGHT",
                sidebarStyle: "EXPANDED",
                emailNotifications: true,
                pushNotifications: true,
                smsAlerts: false,
                attendanceAlerts: true,
                examReminders: true,
                enrollmentAlerts: true,
                language: "en",
            };
            return preferences;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update user preferences
     */
    async updateUserPreferences(userId, input) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new BadRequestError("User not found");
            }
            // Validate theme
            if (input.theme && !["LIGHT", "DARK", "SYSTEM"].includes(input.theme)) {
                throw new ValidationError("Invalid theme value");
            }
            // Validate sidebar style
            if (input.sidebarStyle && !["COMPACT", "EXPANDED"].includes(input.sidebarStyle)) {
                throw new ValidationError("Invalid sidebar style");
            }
            // In a real scenario, you might store this in a user_preferences table
            const preferences = {
                userId,
                theme: input.theme || "LIGHT",
                sidebarStyle: input.sidebarStyle || "EXPANDED",
                emailNotifications: input.emailNotifications ?? true,
                pushNotifications: input.pushNotifications ?? true,
                smsAlerts: input.smsAlerts ?? false,
                attendanceAlerts: input.attendanceAlerts ?? true,
                examReminders: input.examReminders ?? true,
                enrollmentAlerts: input.enrollmentAlerts ?? true,
                language: input.language || "en",
                updatedAt: new Date(),
            };
            return preferences;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get user profile
     */
    async getUserProfile(userId) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new BadRequestError("User not found");
            }
            return {
                id: user.id,
                fullName: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update user profile
     */
    async updateUserProfile(userId, input) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new BadRequestError("User not found");
            }
            // Validate email if provided
            if (input.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.email)) {
                    throw new ValidationError("Invalid email format");
                }
                // Check if email is already taken
                const existingUser = await db.user.findUnique({
                    where: { email: input.email },
                });
                if (existingUser && existingUser.id !== userId) {
                    throw new ValidationError("Email is already in use");
                }
            }
            // Update user
            const updatedUser = await db.user.update({
                where: { id: userId },
                data: {
                    name: input.fullName || user.name,
                    email: input.email || user.email,
                    phone: input.phone || user.phone,
                    avatar: input.avatar || user.avatar,
                },
                include: { profile: true },
            });
            return {
                id: updatedUser.id,
                fullName: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                updatedAt: updatedUser.updatedAt,
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Change user password
     */
    async changePassword(userId, input) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new BadRequestError("User not found");
            }
            // Validate current password
            const isPasswordValid = await bcryptjs.compare(input.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new ValidationError("Current password is incorrect");
            }
            // Validate new password
            if (!input.newPassword || input.newPassword.length < 8) {
                throw new ValidationError("Password must be at least 8 characters long");
            }
            if (input.newPassword !== input.confirmPassword) {
                throw new ValidationError("Passwords do not match");
            }
            if (input.newPassword === input.currentPassword) {
                throw new ValidationError("New password must be different from current password");
            }
            // Hash new password
            const hashedPassword = await bcryptjs.hash(input.newPassword, 10);
            // Update password
            await db.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            return {
                success: true,
                message: "Password changed successfully",
                updatedAt: new Date(),
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Toggle two-factor authentication setting for a user
     */
    async toggleTwoFactor(userId, enabled) {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw new BadRequestError("User not found");
        }
        const key = `twoFactorEnabled:${userId}`;
        await db.setting.upsert({
            where: { key },
            update: { value: String(enabled) },
            create: { key, value: String(enabled) },
        });
        return {
            success: true,
            enabled,
            message: `Two-factor authentication ${enabled ? "enabled" : "disabled"} successfully`,
            updatedAt: new Date(),
        };
    }
    /**
     * Update notification preferences
     */
    async updateNotificationPreferences(userId, input) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new BadRequestError("User not found");
            }
            const preferences = {
                userId,
                emailNotifications: input.emailNotifications,
                pushNotifications: input.pushNotifications,
                smsAlerts: input.smsAlerts,
                attendanceAlerts: input.attendanceAlerts,
                examReminders: input.examReminders,
                enrollmentAlerts: input.enrollmentAlerts,
                updatedAt: new Date(),
            };
            return preferences;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update appearance settings
     */
    async updateAppearanceSettings(userId, input) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new BadRequestError("User not found");
            }
            // Validate theme
            if (!["LIGHT", "DARK", "SYSTEM"].includes(input.theme)) {
                throw new ValidationError("Invalid theme value");
            }
            // Validate sidebar style
            if (!["COMPACT", "EXPANDED"].includes(input.sidebarStyle)) {
                throw new ValidationError("Invalid sidebar style");
            }
            const settings = {
                theme: input.theme,
                sidebarStyle: input.sidebarStyle,
                language: input.language || "en",
                updatedAt: new Date(),
            };
            return settings;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get specific setting by key
     */
    async getSettingByKey(key) {
        try {
            const setting = await db.setting.findUnique({
                where: { key },
            });
            if (!setting) {
                throw new BadRequestError(`Setting with key "${key}" not found`);
            }
            return setting;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Bulk update settings
     */
    async bulkUpdateSettings(input) {
        try {
            if (!input.settings || Object.keys(input.settings).length === 0) {
                throw new ValidationError("Settings object is required");
            }
            let updated = 0;
            for (const [key, value] of Object.entries(input.settings)) {
                if (!key?.trim())
                    continue;
                await db.setting.upsert({
                    where: { key },
                    update: { value: String(value) },
                    create: { key, value: String(value) },
                });
                updated++;
            }
            return {
                success: true,
                updated,
                message: `${updated} settings updated successfully`,
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Helper method to get setting value with fallback
     */
    getSettingValue(settings, key, fallback) {
        const setting = settings.find((s) => s.key === key);
        return setting?.value || fallback;
    }
}
export default new SettingService();
//# sourceMappingURL=setting.service.js.map