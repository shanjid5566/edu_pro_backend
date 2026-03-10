/**
 * Setting Request/Response DTOs
 */

// ========================
// General Settings
// ========================

export interface GeneralSettingsInput {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  academicYear: string;
}

export interface GeneralSettingsResponse {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  academicYear: string;
  updatedAt: Date;
}

// ========================
// User Preferences Settings
// ========================

export interface UserPreferencesInput {
  theme?: "LIGHT" | "DARK" | "SYSTEM";
  sidebarStyle?: "COMPACT" | "EXPANDED";
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsAlerts?: boolean;
  attendanceAlerts?: boolean;
  examReminders?: boolean;
  enrollmentAlerts?: boolean;
  language?: string;
}

export interface UserPreferencesResponse {
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
}

// ========================
// Security Settings
// ========================

export interface SecuritySettingsInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled?: boolean;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
  updatedAt: Date;
}

export interface TwoFactorResponse {
  success: boolean;
  message: string;
  qrCode?: string;
  backupCodes?: string[];
}

// ========================
// Update Profile Settings
// ========================

export interface UpdateProfileInput {
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ProfileSettingsResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  updatedAt: Date;
}

// ========================
// Notification Preferences
// ========================

export interface NotificationPreferencesInput {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  attendanceAlerts: boolean;
  examReminders: boolean;
  enrollmentAlerts: boolean;
}

export interface NotificationPreferencesResponse {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  attendanceAlerts: boolean;
  examReminders: boolean;
  enrollmentAlerts: boolean;
  updatedAt: Date;
}

// ========================
// Appearance Settings
// ========================

export interface AppearanceSettingsInput {
  theme: "LIGHT" | "DARK" | "SYSTEM";
  sidebarStyle: "COMPACT" | "EXPANDED";
  language?: string;
}

export interface AppearanceSettingsResponse {
  theme: "LIGHT" | "DARK" | "SYSTEM";
  sidebarStyle: "COMPACT" | "EXPANDED";
  language: string;
  updatedAt: Date;
}

// ========================
// Generic Setting
// ========================

export interface SettingItem {
  key: string;
  value: string;
  description?: string;
  updatedBy?: string;
  updatedAt: Date;
}

// ========================
// Bulk Settings Update
// ========================

export interface BulkSettingsInput {
  settings: Record<string, any>;
}

export interface BulkSettingsResponse {
  success: boolean;
  updated: number;
  message: string;
}
