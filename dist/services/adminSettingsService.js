"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSettingsService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AdminSettingsService {
    // ===============================
    // General Settings (System)
    // ===============================
    async getGeneralSettings() {
        try {
            const settings = await prisma_js_1.prisma.setting.findMany();
            const settingsObj = {};
            settings.forEach(setting => {
                settingsObj[setting.key] = setting.value;
            });
            return {
                schoolName: settingsObj.schoolName || "",
                schoolEmail: settingsObj.schoolEmail || "",
                phone: settingsObj.phone || "",
                academicYear: settingsObj.academicYear || "",
                address: settingsObj.address || "",
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch general settings: ${error}`);
        }
    }
    async updateGeneralSettings(data) {
        try {
            const updates = [];
            if (data.schoolName) {
                updates.push(prisma_js_1.prisma.setting.upsert({
                    where: { key: "schoolName" },
                    update: { value: data.schoolName },
                    create: { key: "schoolName", value: data.schoolName },
                }));
            }
            if (data.schoolEmail) {
                updates.push(prisma_js_1.prisma.setting.upsert({
                    where: { key: "schoolEmail" },
                    update: { value: data.schoolEmail },
                    create: { key: "schoolEmail", value: data.schoolEmail },
                }));
            }
            if (data.phone) {
                updates.push(prisma_js_1.prisma.setting.upsert({
                    where: { key: "phone" },
                    update: { value: data.phone },
                    create: { key: "phone", value: data.phone },
                }));
            }
            if (data.academicYear) {
                updates.push(prisma_js_1.prisma.setting.upsert({
                    where: { key: "academicYear" },
                    update: { value: data.academicYear },
                    create: { key: "academicYear", value: data.academicYear },
                }));
            }
            if (data.address) {
                updates.push(prisma_js_1.prisma.setting.upsert({
                    where: { key: "address" },
                    update: { value: data.address },
                    create: { key: "address", value: data.address },
                }));
            }
            if (updates.length === 0) {
                throw new Error("No settings provided to update");
            }
            await Promise.all(updates);
            return this.getGeneralSettings();
        }
        catch (error) {
            throw new Error(`Failed to update general settings: ${error}`);
        }
    }
    // ===============================
    // Profile Settings
    // ===============================
    async getProfileSettings(userId) {
        try {
            const user = await prisma_js_1.prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new Error("User not found");
            }
            return {
                id: user.id,
                fullName: user.name,
                email: user.email,
                phone: user.phone || "",
                avatar: user.avatar || "",
                role: user.role,
                address: user.profile?.address || "",
                dateOfBirth: user.profile?.dateOfBirth || null,
                gender: user.profile?.gender || "",
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch profile settings: ${error}`);
        }
    }
    async updateProfileSettings(userId, data) {
        try {
            const [user] = await Promise.all([
                prisma_js_1.prisma.user.update({
                    where: { id: userId },
                    data: {
                        name: data.fullName,
                        phone: data.phone,
                        avatar: data.avatar,
                    },
                    include: { profile: true },
                }),
                prisma_js_1.prisma.profile.upsert({
                    where: { userId },
                    update: {
                        address: data.address,
                        dateOfBirth: data.dateOfBirth,
                        gender: data.gender,
                    },
                    create: {
                        userId,
                        address: data.address,
                        dateOfBirth: data.dateOfBirth,
                        gender: data.gender,
                    },
                }),
            ]);
            return this.getProfileSettings(userId);
        }
        catch (error) {
            throw new Error(`Failed to update profile settings: ${error}`);
        }
    }
    // ===============================
    // Notification Preferences
    // ===============================
    async getNotificationPreferences(userId) {
        try {
            let preferences = await prisma_js_1.prisma.notificationPreference.findUnique({
                where: { userId },
            });
            if (!preferences) {
                preferences = await prisma_js_1.prisma.notificationPreference.create({
                    data: { userId },
                });
            }
            return {
                id: preferences.id,
                emailNotifications: preferences.emailNotifications,
                pushNotifications: preferences.pushNotifications,
                smsAlerts: preferences.smsAlerts,
                attendanceAlerts: preferences.attendanceAlerts,
                examReminders: preferences.examReminders,
                enrollmentAlerts: preferences.enrollmentAlerts,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch notification preferences: ${error}`);
        }
    }
    async updateNotificationPreferences(userId, data) {
        try {
            const preferences = await prisma_js_1.prisma.notificationPreference.upsert({
                where: { userId },
                update: data,
                create: {
                    userId,
                    ...data,
                },
            });
            return {
                id: preferences.id,
                emailNotifications: preferences.emailNotifications,
                pushNotifications: preferences.pushNotifications,
                smsAlerts: preferences.smsAlerts,
                attendanceAlerts: preferences.attendanceAlerts,
                examReminders: preferences.examReminders,
                enrollmentAlerts: preferences.enrollmentAlerts,
            };
        }
        catch (error) {
            throw new Error(`Failed to update notification preferences: ${error}`);
        }
    }
    // ===============================
    // Security Settings
    // ===============================
    async updatePassword(userId, currentPassword, newPassword) {
        try {
            const user = await prisma_js_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error("User not found");
            }
            const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error("Current password is incorrect");
            }
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
            await prisma_js_1.prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            return { message: "Password updated successfully" };
        }
        catch (error) {
            throw new Error(`Failed to update password: ${error}`);
        }
    }
    // ===============================
    // Appearance/Theme Settings
    // ===============================
    async getUserPreferences(userId) {
        try {
            let preferences = await prisma_js_1.prisma.userPreference.findUnique({
                where: { userId },
            });
            if (!preferences) {
                preferences = await prisma_js_1.prisma.userPreference.create({
                    data: { userId },
                });
            }
            return {
                id: preferences.id,
                theme: preferences.theme,
                sidebarStyle: preferences.sidebarStyle,
                language: preferences.language,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch user preferences: ${error}`);
        }
    }
    async updateUserPreferences(userId, data) {
        try {
            const preferences = await prisma_js_1.prisma.userPreference.upsert({
                where: { userId },
                update: data,
                create: {
                    userId,
                    ...data,
                },
            });
            return {
                id: preferences.id,
                theme: preferences.theme,
                sidebarStyle: preferences.sidebarStyle,
                language: preferences.language,
            };
        }
        catch (error) {
            throw new Error(`Failed to update user preferences: ${error}`);
        }
    }
}
exports.AdminSettingsService = AdminSettingsService;
