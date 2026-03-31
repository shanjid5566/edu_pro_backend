import { Request, Response } from "express";
import { AdminSettingsService } from "../services/adminSettingsService.js";

const adminSettingsService = new AdminSettingsService();

export class AdminSettingsController {
  // ===============================
  // General Settings
  // ===============================
  async getGeneralSettings(req: Request, res: Response) {
    try {
      const settings = await adminSettingsService.getGeneralSettings();
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateGeneralSettings(req: Request, res: Response) {
    try {
      const { schoolName, schoolEmail, phone, academicYear, address } = req.body;

      if (!schoolName && !schoolEmail && !phone && !academicYear && !address) {
        return res
          .status(400)
          .json({ success: false, message: "No fields provided to update" });
      }

      const settings = await adminSettingsService.updateGeneralSettings({
        schoolName,
        schoolEmail,
        phone,
        academicYear,
        address,
      });

      res.json({
        success: true,
        message: "General settings updated successfully",
        data: settings,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ===============================
  // Profile Settings
  // ===============================
  async getProfileSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const profile = await adminSettingsService.getProfileSettings(userId);
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateProfileSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { fullName, phone, avatar, address, dateOfBirth, gender } =
        req.body;

      const profile = await adminSettingsService.updateProfileSettings(
        userId,
        {
          fullName,
          phone,
          avatar,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender,
        }
      );

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ===============================
  // Notification Preferences
  // ===============================
  async getNotificationPreferences(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const preferences =
        await adminSettingsService.getNotificationPreferences(userId);
      res.json({ success: true, data: preferences });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateNotificationPreferences(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const {
        emailNotifications,
        pushNotifications,
        smsAlerts,
        attendanceAlerts,
        examReminders,
        enrollmentAlerts,
      } = req.body;

      const preferences =
        await adminSettingsService.updateNotificationPreferences(userId, {
          emailNotifications,
          pushNotifications,
          smsAlerts,
          attendanceAlerts,
          examReminders,
          enrollmentAlerts,
        });

      res.json({
        success: true,
        message: "Notification preferences updated successfully",
        data: preferences,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ===============================
  // Security Settings
  // ===============================
  async updatePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current and new password are required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New passwords do not match",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }

      await adminSettingsService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ===============================
  // Appearance/Theme Settings
  // ===============================
  async getUserPreferences(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const preferences =
        await adminSettingsService.getUserPreferences(userId);
      res.json({ success: true, data: preferences });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUserPreferences(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { theme, sidebarStyle, language } = req.body;

      const preferences = await adminSettingsService.updateUserPreferences(
        userId,
        {
          theme,
          sidebarStyle,
          language,
        }
      );

      res.json({
        success: true,
        message: "Preferences updated successfully",
        data: preferences,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const adminSettingsController = new AdminSettingsController();
