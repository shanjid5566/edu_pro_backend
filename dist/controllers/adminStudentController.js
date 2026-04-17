"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminStudentService_1 = __importDefault(require("../services/adminStudentService"));
class AdminStudentController {
    /**
     * Get all students with pagination and filters
     */
    async getAllStudents(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || undefined;
            const classId = req.query.classId || undefined;
            const status = req.query.status || undefined;
            const skip = (page - 1) * limit;
            const result = await adminStudentService_1.default.getAllStudents({
                skip,
                take: limit,
                search,
                classId,
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
     * Get student profile by ID
     */
    async getStudentById(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await adminStudentService_1.default.getStudentById(id);
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
     * Create new student
     */
    async createStudent(req, res) {
        try {
            const { fullName, email, password, classId, section, rollNumber, dateOfBirth, gender, phone, parentName, address, } = req.body;
            // Validation
            if (!fullName ||
                !email ||
                !password ||
                !classId ||
                !section ||
                !rollNumber) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields (fullName, email, password, classId, section, rollNumber)",
                });
            }
            // Validate password length
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long",
                });
            }
            const result = await adminStudentService_1.default.createStudent({
                fullName,
                email,
                password,
                classId,
                section,
                rollNumber,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                phone,
                parentName,
                address,
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
     * Update student
     */
    async updateStudent(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updateData = req.body;
            const result = await adminStudentService_1.default.updateStudent(id, updateData);
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
     * Delete student
     */
    async deleteStudent(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await adminStudentService_1.default.deleteStudent(id);
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
     * Get students by class
     */
    async getStudentsByClass(req, res) {
        try {
            const classId = Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId;
            const result = await adminStudentService_1.default.getStudentsByClass(classId);
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
     * Search students
     */
    async searchStudents(req, res) {
        try {
            const { query } = req.query;
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
            }
            const result = await adminStudentService_1.default.searchStudents(query, limit);
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
     * Export students to CSV
     */
    async exportStudentsToCSV(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10000;
            const search = req.query.search || undefined;
            const classId = req.query.classId || undefined;
            const status = req.query.status || undefined;
            const skip = (page - 1) * limit;
            const result = await adminStudentService_1.default.exportStudentsToCSV({
                skip,
                take: limit,
                search,
                classId,
                status,
            });
            if (result.success) {
                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", "attachment; filename=students.csv");
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
     * Get all classes
     */
    async getAllClasses(req, res) {
        try {
            const result = await adminStudentService_1.default.getAllClasses();
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
exports.default = new AdminStudentController();
