import { Request, Response } from "express";
import teacherAttendanceService from "../services/teacherAttendanceService.js";
import { AttendanceStatus } from "../../prisma/generated/prisma/client";

class TeacherAttendanceController {
  // Get students in a class for attendance marking
  async getClassStudents(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;
      const { classId } = req.params;

      if (!teacherId) {
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

      const result = await teacherAttendanceService.getClassStudentsForAttendance(
        teacherId,
        classId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getClassStudents:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Mark attendance for a class
  async markAttendance(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;
      const { classId } = req.params;
      const { attendanceData, date } = req.body;

      if (!teacherId) {
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

      if (!attendanceData || !Array.isArray(attendanceData)) {
        return res.status(400).json({
          success: false,
          message: "Attendance data array is required",
        });
      }

      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Date is required",
        });
      }

      // Validate attendance data
      for (const item of attendanceData) {
        if (!item.studentId || !item.status) {
          return res.status(400).json({
            success: false,
            message: "Each attendance record must have studentId and status",
          });
        }
        if (!["PRESENT", "ABSENT", "LATE"].includes(item.status)) {
          return res.status(400).json({
            success: false,
            message: "Invalid status. Must be PRESENT, ABSENT, or LATE",
          });
        }
      }

      const attendanceDate = new Date(date);

      const result = await teacherAttendanceService.markAttendance(
        teacherId,
        classId,
        attendanceData,
        attendanceDate
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error in markAttendance:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get attendance records for a class
  async getAttendanceRecords(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;
      const { classId } = req.params;
      const { startDate, endDate } = req.query;

      if (!teacherId) {
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

      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate) {
        start = new Date(startDate as string);
      }
      if (endDate) {
        end = new Date(endDate as string);
      }

      const result = await teacherAttendanceService.getClassAttendanceRecords(
        teacherId,
        classId,
        start,
        end
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAttendanceRecords:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get student attendance summary
  async getStudentSummary(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;
      const { classId, studentId } = req.params;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!classId || !studentId) {
        return res.status(400).json({
          success: false,
          message: "Class ID and Student ID are required",
        });
      }

      const result = await teacherAttendanceService.getStudentAttendanceSummary(
        teacherId,
        classId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getStudentSummary:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new TeacherAttendanceController();
