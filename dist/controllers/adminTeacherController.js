"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminTeacherService_1 = __importDefault(require("../services/adminTeacherService"));
class AdminTeacherController {
    /**
     * Get all teachers with pagination and filters
     */
    async getAllTeachers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || undefined;
            const department = req.query.department || undefined;
            const status = req.query.status || undefined;
            const skip = (page - 1) * limit;
            const result = await adminTeacherService_1.default.getAllTeachers({
                skip,
                take: limit,
                search,
                department,
                status,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get teacher profile by ID
     */
    async getTeacherById(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await adminTeacherService_1.default.getTeacherById(id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Create new teacher
     */
    async createTeacher(req, res) {
        try {
            const { fullName, email, password, phone, department, subjects, assignClasses, joinDate, } = req.body;
            // Validation
            if (!fullName || !email || !password || !department) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields (fullName, email, password, department)",
                });
            }
            // Validate password length
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long",
                });
            }
            const result = await adminTeacherService_1.default.createTeacher({
                fullName,
                email,
                password,
                phone,
                department,
                subjects,
                assignClasses,
                joinDate: new Date(joinDate),
            });
            const statusCode = result.success ? 201 : 400;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Update teacher
     */
    async updateTeacher(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updateData = req.body;
            const result = await adminTeacherService_1.default.updateTeacher(id, updateData);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Delete teacher
     */
    async deleteTeacher(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await adminTeacherService_1.default.deleteTeacher(id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get teachers by department
     */
    async getTeachersByDepartment(req, res) {
        try {
            const department = Array.isArray(req.params.department)
                ? req.params.department[0]
                : req.params.department;
            const result = await adminTeacherService_1.default.getTeachersByDepartment(department);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Search teachers
     */
    async searchTeachers(req, res) {
        try {
            const { query } = req.query;
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
            }
            const result = await adminTeacherService_1.default.searchTeachers(query, limit);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Export teachers to CSV
     */
    async exportTeachersToCSV(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10000;
            const search = req.query.search || undefined;
            const department = req.query.department || undefined;
            const status = req.query.status || undefined;
            const skip = (page - 1) * limit;
            const result = await adminTeacherService_1.default.exportTeachersToCSV({
                skip,
                take: limit,
                search,
                department,
                status,
            });
            if (result.success) {
                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", "attachment; filename=teachers.csv");
                return res.send(result.data);
            }
            return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get all departments
     */
    async getAllDepartments(req, res) {
        try {
            const result = await adminTeacherService_1.default.getAllDepartments();
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new AdminTeacherController();
