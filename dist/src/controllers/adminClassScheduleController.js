"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminClassScheduleService_1 = __importDefault(require("../services/adminClassScheduleService"));
class AdminClassScheduleController {
    /**
     * Get all schedules
     */
    async getAllSchedules(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const classId = req.query.classId || "";
            const day = req.query.day || "";
            const skip = (page - 1) * limit;
            const result = await adminClassScheduleService_1.default.getAllSchedules({
                skip,
                take: limit,
                search: search || undefined,
                classId: classId || undefined,
                day: day || undefined,
            });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch schedules",
            });
        }
    }
    /**
     * Get schedule by ID
     */
    async getScheduleById(req, res) {
        try {
            const scheduleId = req.params.scheduleId;
            if (!scheduleId) {
                res.status(400).json({
                    success: false,
                    message: "Schedule ID is required",
                });
                return;
            }
            const result = await adminClassScheduleService_1.default.getScheduleById(scheduleId);
            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch schedule",
            });
        }
    }
    /**
     * Create schedule
     */
    async createSchedule(req, res) {
        try {
            const { classId, day, subjectId, teacherId, startTime, endTime, roomNumber } = req.body;
            if (!classId || !day || !subjectId || !teacherId || !startTime || !endTime || !roomNumber) {
                res.status(400).json({
                    success: false,
                    message: "Class, day, subject, teacher, start time, end time and room number are required",
                });
                return;
            }
            const result = await adminClassScheduleService_1.default.createSchedule({
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to create schedule",
            });
        }
    }
    /**
     * Update schedule
     */
    async updateSchedule(req, res) {
        try {
            const scheduleId = req.params.scheduleId;
            const { day, subjectId, teacherId, startTime, endTime, roomNumber } = req.body;
            if (!scheduleId) {
                res.status(400).json({
                    success: false,
                    message: "Schedule ID is required",
                });
                return;
            }
            const result = await adminClassScheduleService_1.default.updateSchedule(scheduleId, {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update schedule",
            });
        }
    }
    /**
     * Delete schedule
     */
    async deleteSchedule(req, res) {
        try {
            const scheduleId = req.params.scheduleId;
            if (!scheduleId) {
                res.status(400).json({
                    success: false,
                    message: "Schedule ID is required",
                });
                return;
            }
            const result = await adminClassScheduleService_1.default.deleteSchedule(scheduleId);
            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to delete schedule",
            });
        }
    }
    /**
     * Search schedules
     */
    async searchSchedules(req, res) {
        try {
            const query = req.query.q || "";
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
                return;
            }
            const result = await adminClassScheduleService_1.default.searchSchedules(query, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to search schedules",
            });
        }
    }
    /**
     * Get schedules by class
     */
    async getSchedulesByClass(req, res) {
        try {
            const classId = req.params.classId;
            if (!classId) {
                res.status(400).json({
                    success: false,
                    message: "Class ID is required",
                });
                return;
            }
            const result = await adminClassScheduleService_1.default.getSchedulesByClass(classId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch schedules",
            });
        }
    }
    /**
     * Get schedules by day
     */
    async getSchedulesByDay(req, res) {
        try {
            const day = req.params.day;
            if (!day) {
                res.status(400).json({
                    success: false,
                    message: "Day is required",
                });
                return;
            }
            const result = await adminClassScheduleService_1.default.getSchedulesByDay(day);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch schedules",
            });
        }
    }
    /**
     * Export schedules to CSV
     */
    async exportSchedulesToCSV(req, res) {
        try {
            const search = req.query.search || "";
            const classId = req.query.classId || "";
            const day = req.query.day || "";
            const result = await adminClassScheduleService_1.default.exportSchedulesToCSV({
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to export schedules",
            });
        }
    }
    /**
     * Get all classes for dropdown
     */
    async getAllClasses(req, res) {
        try {
            const result = await adminClassScheduleService_1.default.getAllClasses();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch classes",
            });
        }
    }
    /**
     * Get all teachers for dropdown
     */
    async getAllTeachers(req, res) {
        try {
            const result = await adminClassScheduleService_1.default.getAllTeachers();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch teachers",
            });
        }
    }
}
exports.default = new AdminClassScheduleController();
