import { GeneralSettingsInput, UserPreferencesInput, SecuritySettingsInput, UpdateProfileInput, NotificationPreferencesInput, AppearanceSettingsInput, BulkSettingsInput } from "../types/settings.dto.js";
export declare class SettingService {
    /**
     * Get all general settings
     */
    getGeneralSettings(): Promise<{
        schoolName: string;
        schoolEmail: string;
        schoolPhone: string;
        schoolAddress: string;
        academicYear: string;
    }>;
    /**
     * Update general settings (admin only)
     */
    updateGeneralSettings(input: GeneralSettingsInput): Promise<{
        updatedAt: Date;
        schoolName: string;
        schoolEmail: string;
        schoolPhone: string;
        schoolAddress: string;
        academicYear: string;
    }>;
    /**
     * Get user preferences
     */
    getUserPreferences(userId: string): Promise<{
        userId: string;
        theme: string;
        sidebarStyle: string;
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsAlerts: boolean;
        attendanceAlerts: boolean;
        examReminders: boolean;
        enrollmentAlerts: boolean;
        language: string;
    }>;
    /**
     * Update user preferences
     */
    updateUserPreferences(userId: string, input: UserPreferencesInput): Promise<{
        userId: string;
        theme: "LIGHT" | "DARK" | "SYSTEM";
        sidebarStyle: "COMPACT" | "EXPANDED";
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsAlerts: boolean;
        attendanceAlerts: boolean;
        examReminders: boolean;
        enrollmentAlerts: boolean;
        language: string;
        updatedAt: Date;
    }>;
    /**
     * Get user profile
     */
    getUserProfile(userId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
        updatedAt: Date;
    }>;
    /**
     * Update user profile
     */
    updateUserProfile(userId: string, input: UpdateProfileInput): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
        updatedAt: Date;
    }>;
    /**
     * Change user password
     */
    changePassword(userId: string, input: SecuritySettingsInput): Promise<{
        success: boolean;
        message: string;
        updatedAt: Date;
    }>;
    /**
     * Toggle two-factor authentication setting for a user
     */
    toggleTwoFactor(userId: string, enabled: boolean): Promise<{
        success: boolean;
        enabled: boolean;
        message: string;
        updatedAt: Date;
    }>;
    /**
     * Update notification preferences
     */
    updateNotificationPreferences(userId: string, input: NotificationPreferencesInput): Promise<{
        userId: string;
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsAlerts: boolean;
        attendanceAlerts: boolean;
        examReminders: boolean;
        enrollmentAlerts: boolean;
        updatedAt: Date;
    }>;
    /**
     * Update appearance settings
     */
    updateAppearanceSettings(userId: string, input: AppearanceSettingsInput): Promise<{
        theme: "LIGHT" | "DARK" | "SYSTEM";
        sidebarStyle: "COMPACT" | "EXPANDED";
        language: string;
        updatedAt: Date;
    }>;
    /**
     * Get specific setting by key
     */
    getSettingByKey(key: string): Promise<{
        id: string;
        key: string;
        value: string;
    }>;
    /**
     * Bulk update settings
     */
    bulkUpdateSettings(input: BulkSettingsInput): Promise<{
        success: boolean;
        updated: number;
        message: string;
    }>;
    /**
     * Helper method to get setting value with fallback
     */
    private getSettingValue;
}
declare const _default: SettingService;
export default _default;
//# sourceMappingURL=setting.service.d.ts.map