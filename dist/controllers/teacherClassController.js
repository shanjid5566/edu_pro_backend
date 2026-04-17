"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacherClassService_js_1 = __importDefault(require("../services/teacherClassService.js"));
class TeacherClassController {
    // Get all assigned classes for teacher
    async getMyClasses(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherClassService_js_1.default.getMyClasses(userId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getMyClasses:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get specific class details
    async getClassDetails(req, res) {
        try {
            const userId = req.user?.id;
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
            const result = await teacherClassService_js_1.default.getClassDetails(userId, classId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getClassDetails:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get today's class schedule
    async getTodaySchedule(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherClassService_js_1.default.getTodayClassSchedule(userId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getTodaySchedule:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get class statistics
    async getClassStatistics(req, res) {
        try {
            const userId = req.user?.id;
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
            const result = await teacherClassService_js_1.default.getClassStatistics(userId, classId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getClassStatistics:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new TeacherClassController();
