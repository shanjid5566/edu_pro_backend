import { Request, Response } from "express";
import studentClassService from "../services/studentClassService.js";

class StudentClassController {
  // Get all my classes
  async getMyClasses(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentClassService.getMyClasses(studentId);
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

  // Get class schedule by day
  async getClassScheduleByDay(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { day } = req.query;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentClassService.getClassScheduleByDay(
        studentId,
        day as string
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getClassScheduleByDay:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get today's classes
  async getTodayClasses(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentClassService.getTodayClasses(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getTodayClasses:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get subject details
  async getSubjectDetails(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { subjectId } = req.params;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message: "Subject ID is required",
        });
      }

      const result = await studentClassService.getSubjectDetails(
        studentId,
        subjectId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getSubjectDetails:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get weekly timetable
  async getWeeklyTimetable(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentClassService.getWeeklyTimetable(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getWeeklyTimetable:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new StudentClassController();
