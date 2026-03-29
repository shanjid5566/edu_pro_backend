import { Request, Response } from "express";
import adminClassScheduleService from "../services/adminClassScheduleService";

class AdminClassScheduleController {
  /**
   * Get all schedules
   */
  async getAllSchedules(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const classId = (req.query.classId as string) || "";
      const day = (req.query.day as string) || "";

      const skip = (page - 1) * limit;

      const result = await adminClassScheduleService.getAllSchedules({
        skip,
        take: limit,
        search: search || undefined,
        classId: classId || undefined,
        day: day || undefined,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch schedules",
      });
    }
  }

  /**
   * Get schedule by ID
   */
  async getScheduleById(req: Request, res: Response) {
    try {
      const scheduleId = req.params.scheduleId as string;

      if (!scheduleId) {
        res.status(400).json({
          success: false,
          message: "Schedule ID is required",
        });
        return;
      }

      const result = await adminClassScheduleService.getScheduleById(scheduleId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch schedule",
      });
    }
  }

  /**
   * Create schedule
   */
  async createSchedule(req: Request, res: Response) {
    try {
      const { classId, day, subjectId, teacherId, startTime, endTime, roomNumber } = req.body;

      if (!classId || !day || !subjectId || !teacherId || !startTime || !endTime || !roomNumber) {
        res.status(400).json({
          success: false,
          message: "Class, day, subject, teacher, start time, end time and room number are required",
        });
        return;
      }

      const result = await adminClassScheduleService.createSchedule({
        classId,
        subjectId,
        day,
        teacherId,
        startTime,
        endTime,
        roomNumber,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create schedule",
      });
    }
  }

  /**
   * Update schedule
   */
  async updateSchedule(req: Request, res: Response) {
    try {
      const scheduleId = req.params.scheduleId as string;
      const { day, subjectId, teacherId, startTime, endTime, roomNumber } = req.body;

      if (!scheduleId) {
        res.status(400).json({
          success: false,
          message: "Schedule ID is required",
        });
        return;
      }

      const result = await adminClassScheduleService.updateSchedule(scheduleId, {
        day,
        subjectId,
        teacherId,
        startTime,
        endTime,
        roomNumber,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update schedule",
      });
    }
  }

  /**
   * Delete schedule
   */
  async deleteSchedule(req: Request, res: Response) {
    try {
      const scheduleId = req.params.scheduleId as string;

      if (!scheduleId) {
        res.status(400).json({
          success: false,
          message: "Schedule ID is required",
        });
        return;
      }

      const result = await adminClassScheduleService.deleteSchedule(scheduleId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete schedule",
      });
    }
  }

  /**
   * Search schedules
   */
  async searchSchedules(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || "";
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const result = await adminClassScheduleService.searchSchedules(query, limit);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to search schedules",
      });
    }
  }

  /**
   * Get schedules by class
   */
  async getSchedulesByClass(req: Request, res: Response) {
    try {
      const classId = req.params.classId as string;

      if (!classId) {
        res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
        return;
      }

      const result = await adminClassScheduleService.getSchedulesByClass(classId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch schedules",
      });
    }
  }

  /**
   * Get schedules by day
   */
  async getSchedulesByDay(req: Request, res: Response) {
    try {
      const day = req.params.day as string;

      if (!day) {
        res.status(400).json({
          success: false,
          message: "Day is required",
        });
        return;
      }

      const result = await adminClassScheduleService.getSchedulesByDay(day);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch schedules",
      });
    }
  }

  /**
   * Export schedules to CSV
   */
  async exportSchedulesToCSV(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || "";
      const classId = (req.query.classId as string) || "";
      const day = (req.query.day as string) || "";

      const result = await adminClassScheduleService.exportSchedulesToCSV({
        skip: 0,
        take: 1000,
        search: search || undefined,
        classId: classId || undefined,
        day: day || undefined,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=schedules.csv");
      res.send(result.data);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to export schedules",
      });
    }
  }

  /**
   * Get all classes for dropdown
   */
  async getAllClasses(req: Request, res: Response) {
    try {
      const result = await adminClassScheduleService.getAllClasses();

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch classes",
      });
    }
  }

  /**
   * Get all teachers for dropdown
   */
  async getAllTeachers(req: Request, res: Response) {
    try {
      const result = await adminClassScheduleService.getAllTeachers();

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch teachers",
      });
    }
  }
}

export default new AdminClassScheduleController();
