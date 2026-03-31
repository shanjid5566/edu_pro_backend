import { Request, Response } from "express";
import teacherDashboardService from "../services/teacherDashboardService.js";

class TeacherDashboardController {
  async getDashboardOverview(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherDashboardService.getDashboardOverview(
        teacherId
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getDashboardOverview:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  async getAttendanceTrend(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;
      const months = parseInt(req.query.months as string) || 6;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherDashboardService.getAttendanceTrend(
        teacherId,
        months
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAttendanceTrend:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  async getStudentPerformance(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result =
        await teacherDashboardService.getStudentPerformanceBySubject(
          teacherId
        );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getStudentPerformance:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  async getMyClasses(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherDashboardService.getMyClasses(teacherId);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getMyClasses:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  async getTeacherProfile(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherDashboardService.getTeacherProfile(
        teacherId
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getTeacherProfile:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new TeacherDashboardController();
