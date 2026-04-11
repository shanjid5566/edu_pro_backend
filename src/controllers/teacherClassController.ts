import { Request, Response } from "express";
import teacherClassService from "../services/teacherClassService.js";

class TeacherClassController {
  // Get all assigned classes for teacher
  async getMyClasses(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherClassService.getMyClasses(userId);
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

  // Get specific class details
  async getClassDetails(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { classId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!classId) {
        return res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
      }

      const result = await teacherClassService.getClassDetails(userId, classId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getClassDetails:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get today's class schedule
  async getTodaySchedule(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherClassService.getTodayClassSchedule(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getTodaySchedule:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get class statistics
  async getClassStatistics(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { classId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!classId) {
        return res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
      }

      const result = await teacherClassService.getClassStatistics(userId, classId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getClassStatistics:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new TeacherClassController();
