import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export class AdminSettingsService {
  // ===============================
  // General Settings (System)
  // ===============================
  async getGeneralSettings() {
    try {
      const settings = await prisma.setting.findMany();
      const settingsObj: any = {};
      
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
    } catch (error) {
      throw new Error(`Failed to fetch general settings: ${error}`);
    }
  }

  async updateGeneralSettings(data: {
    schoolName?: string;
    schoolEmail?: string;
    phone?: string;
    academicYear?: string;
    address?: string;
  }) {
    try {
      const updates = [];

      if (data.schoolName) {
        updates.push(
          prisma.setting.upsert({
            where: { key: "schoolName" },
            update: { value: data.schoolName },
            create: { key: "schoolName", value: data.schoolName },
          })
        );
      }

      if (data.schoolEmail) {
        updates.push(
          prisma.setting.upsert({
            where: { key: "schoolEmail" },
            update: { value: data.schoolEmail },
            create: { key: "schoolEmail", value: data.schoolEmail },
          })
        );
      }

      if (data.phone) {
        updates.push(
          prisma.setting.upsert({
            where: { key: "phone" },
            update: { value: data.phone },
            create: { key: "phone", value: data.phone },
          })
        );
      }

      if (data.academicYear) {
        updates.push(
          prisma.setting.upsert({
            where: { key: "academicYear" },
            update: { value: data.academicYear },
            create: { key: "academicYear", value: data.academicYear },
          })
        );
      }

      if (data.address) {
        updates.push(
          prisma.setting.upsert({
            where: { key: "address" },
            update: { value: data.address },
            create: { key: "address", value: data.address },
          })
        );
      }

      if (updates.length === 0) {
        throw new Error("No settings provided to update");
      }

      await Promise.all(updates);

      return this.getGeneralSettings();
    } catch (error) {
      throw new Error(`Failed to update general settings: ${error}`);
    }
  }

  // ===============================
  // Profile Settings
  // ===============================
  async getProfileSettings(userId: string) {
    try {
      const user = await prisma.user.findUnique({
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
    } catch (error) {
      throw new Error(`Failed to fetch profile settings: ${error}`);
    }
  }

  async updateProfileSettings(
    userId: string,
    data: {
      fullName?: string;
      phone?: string;
      avatar?: string;
      address?: string;
      dateOfBirth?: Date;
      gender?: string;
    }
  ) {
    try {
      const [user] = await Promise.all([
        prisma.user.update({
          where: { id: userId },
          data: {
            name: data.fullName,
            phone: data.phone,
            avatar: data.avatar,
          },
          include: { profile: true },
        }),
        prisma.profile.upsert({
          where: { userId },
          update: {
            address: data.address,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender as any,
          },
          create: {
            userId,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender as any,
          },
        }),
      ]);

      return this.getProfileSettings(userId);
    } catch (error) {
      throw new Error(`Failed to update profile settings: ${error}`);
    }
  }

  // ===============================
  // Notification Preferences
  // ===============================
  async getNotificationPreferences(userId: string) {
    try {
      let preferences = await prisma.notificationPreference.findUnique({
        where: { userId },
      });

      if (!preferences) {
        preferences = await prisma.notificationPreference.create({
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
    } catch (error) {
      throw new Error(`Failed to fetch notification preferences: ${error}`);
    }
  }

  async updateNotificationPreferences(
    userId: string,
    data: {
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      smsAlerts?: boolean;
      attendanceAlerts?: boolean;
      examReminders?: boolean;
      enrollmentAlerts?: boolean;
    }
  ) {
    try {
      const preferences = await prisma.notificationPreference.upsert({
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
    } catch (error) {
      throw new Error(`Failed to update notification preferences: ${error}`);
    }
  }

  // ===============================
  // Security Settings
  // ===============================
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: "Password updated successfully" };
    } catch (error) {
      throw new Error(`Failed to update password: ${error}`);
    }
  }

  // ===============================
  // Appearance/Theme Settings
  // ===============================
  async getUserPreferences(userId: string) {
    try {
      let preferences = await prisma.userPreference.findUnique({
        where: { userId },
      });

      if (!preferences) {
        preferences = await prisma.userPreference.create({
          data: { userId },
        });
      }

      return {
        id: preferences.id,
        theme: preferences.theme,
        sidebarStyle: preferences.sidebarStyle,
        language: preferences.language,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user preferences: ${error}`);
    }
  }

  async updateUserPreferences(
    userId: string,
    data: {
      theme?: string;
      sidebarStyle?: string;
      language?: string;
    }
  ) {
    try {
      const preferences = await prisma.userPreference.upsert({
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
    } catch (error) {
      throw new Error(`Failed to update user preferences: ${error}`);
    }
  }
}
