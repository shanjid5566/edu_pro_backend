/**
 * Student Controller
 * Handles HTTP requests for student management
 */
import { studentService } from "../services/student.service";
import { ValidationError } from "../utils/errors";
import { buildCsv } from "../utils/csv";
export class StudentController {
    /**
     * GET /api/v1/students
     * Get all students with pagination and optional filtering
     * Query params: page, pageSize, search, classId, section, className, class, status
     */
    async getStudents(req, res) {
        try {
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");
            const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
            const sectionParam = String(Array.isArray(req.query.section) ? req.query.section[0] : req.query.section || "");
            const classNameParam = String(Array.isArray(req.query.className) ? req.query.className[0] : req.query.className || req.query.class || "");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            if (page < 1) {
                throw new ValidationError("Page must be greater than 0");
            }
            if (pageSize < 1 || pageSize > 100) {
                throw new ValidationError("PageSize must be between 1 and 100");
            }
            const result = await studentService.getStudents(page, pageSize, searchParam || undefined, classIdParam || undefined, sectionParam || undefined, classNameParam || undefined, statusParam || undefined);
            res.json({
                success: true,
                message: "Students retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve students",
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/students/export
     * Export filtered students as CSV
     */
    async exportStudents(req, res) {
        try {
            const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");
            const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
            const sectionParam = String(Array.isArray(req.query.section) ? req.query.section[0] : req.query.section || "");
            const classNameParam = String(Array.isArray(req.query.className) ? req.query.className[0] : req.query.className || req.query.class || "");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
            const firstPage = await studentService.getStudents(1, 1, searchParam || undefined, classIdParam || undefined, sectionParam || undefined, classNameParam || undefined, statusParam || undefined);
            const pageSize = Math.max(firstPage.total, 1);
            const result = await studentService.getStudents(1, pageSize, searchParam || undefined, classIdParam || undefined, sectionParam || undefined, classNameParam || undefined, statusParam || undefined);
            const rows = result.data.map((student) => ({
                id: student.id,
                name: student.name,
                email: student.email,
                phone: student.phone || "",
                class: `${student.class.name}-${student.class.section}`,
                rollNumber: student.rollNumber,
                status: student.status,
                admissionDate: student.admissionDate,
            }));
            const csv = buildCsv(rows, ["id", "name", "email", "phone", "class", "rollNumber", "status", "admissionDate"]);
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename=students-${new Date().toISOString().slice(0, 10)}.csv`);
            res.status(200).send(csv);
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to export students",
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/students/class/:classId
     * Get students by class
     */
    async getStudentsByClass(req, res) {
        try {
            const classId = String(Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId);
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            if (!classId || !classId.trim()) {
                throw new ValidationError("Class ID is required");
            }
            const result = await studentService.getStudentsByClass(classId, page, pageSize);
            res.json({
                success: true,
                message: "Class students retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve class students",
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/students/:id
     * Get single student by ID with statistics
     */
    async getStudentById(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Student ID is required");
            }
            const student = await studentService.getStudentById(id);
            res.json({
                success: true,
                message: "Student retrieved successfully",
                data: student,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve student",
                error: error.message,
            });
        }
    }
    /**
     * POST /api/v1/students
     * Create new student (Admin only)
     * Body: { name, email, password, phone, classId, section, rollNumber, dateOfBirth, gender, address, parentName, parentEmail }
     */
    async createStudent(req, res) {
        try {
            const { name, email, password, phone, classId, section, rollNumber, dateOfBirth, gender, address, parentName, parentEmail, } = req.body;
            if (!name || !name.trim()) {
                throw new ValidationError("Name is required");
            }
            if (!email || !email.trim()) {
                throw new ValidationError("Email is required");
            }
            if (!password || password.length < 6) {
                throw new ValidationError("Password must be at least 6 characters long");
            }
            if (!classId || !classId.trim()) {
                throw new ValidationError("Class ID is required");
            }
            if (!section || !section.trim()) {
                throw new ValidationError("Section is required");
            }
            if (!rollNumber || !rollNumber.trim()) {
                throw new ValidationError("Roll number is required");
            }
            const student = await studentService.createStudent({
                name,
                email,
                password,
                phone,
                classId,
                section,
                rollNumber,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                gender,
                address,
                parentName,
                parentEmail,
            });
            res.status(201).json({
                success: true,
                message: "Student created successfully",
                data: student,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create student",
                error: error.message,
            });
        }
    }
    /**
     * PUT /api/v1/students/:id
     * Update student information (Admin only)
     * Body: { name, phone, classId, section, rollNumber, dateOfBirth, gender, address, status }
     */
    async updateStudent(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            const { name, phone, classId, section, rollNumber, dateOfBirth, gender, address, status } = req.body;
            if (!id || !id.trim()) {
                throw new ValidationError("Student ID is required");
            }
            const student = await studentService.updateStudent(id, {
                name,
                phone,
                classId,
                section,
                rollNumber,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                gender,
                address,
                status,
            });
            res.json({
                success: true,
                message: "Student updated successfully",
                data: student,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update student",
                error: error.message,
            });
        }
    }
    /**
     * DELETE /api/v1/students/:id
     * Delete student (Admin only)
     */
    async deleteStudent(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Student ID is required");
            }
            await studentService.deleteStudent(id);
            res.json({
                success: true,
                message: "Student deleted successfully",
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete student",
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/students/:id/stats
     * Get student statistics
     */
    async getStudentStats(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Student ID is required");
            }
            const stats = await studentService.getStudentStats(id);
            res.json({
                success: true,
                message: "Student statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve student statistics",
                error: error.message,
            });
        }
    }
}
export const studentController = new StudentController();
//# sourceMappingURL=student.controller.js.map