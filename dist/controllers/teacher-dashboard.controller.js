import { ValidationError } from "../utils/errors.js";
import { teacherDashboardService } from "../services/teacher-dashboard.service.js";
export class TeacherDashboardController {
    async getTeacherDashboard(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const dashboard = await teacherDashboardService.getTeacherDashboard(req.user.id);
            res.json({ success: true, message: "Teacher dashboard retrieved successfully", data: dashboard });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve teacher dashboard", error: error.message });
        }
    }
    async getTeacherClasses(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const classes = await teacherDashboardService.getTeacherClasses(req.user.id);
            res.json({ success: true, message: "Teacher classes retrieved successfully", data: classes });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve teacher classes", error: error.message });
        }
    }
    async getTeacherSchedule(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const dateParam = String(Array.isArray(req.query.date) ? req.query.date[0] : req.query.date || "");
            const parsedDate = dateParam ? new Date(dateParam) : undefined;
            if (parsedDate && Number.isNaN(parsedDate.getTime())) {
                throw new ValidationError("Invalid date format. Use YYYY-MM-DD");
            }
            const schedule = await teacherDashboardService.getTeacherSchedule(req.user.id, parsedDate);
            res.json({ success: true, message: "Teacher schedule retrieved successfully", data: schedule });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve teacher schedule", error: error.message });
        }
    }
    async getTeacherAttendanceSheet(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const classId = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
            const dateParam = String(Array.isArray(req.query.date) ? req.query.date[0] : req.query.date || "");
            if (!classId)
                throw new ValidationError("classId is required");
            const parsedDate = dateParam ? new Date(dateParam) : undefined;
            if (parsedDate && Number.isNaN(parsedDate.getTime())) {
                throw new ValidationError("Invalid date format. Use YYYY-MM-DD");
            }
            const sheet = await teacherDashboardService.getTeacherAttendanceSheet(req.user.id, classId, parsedDate);
            res.json({ success: true, message: "Attendance sheet retrieved successfully", data: sheet });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve attendance sheet", error: error.message });
        }
    }
    async saveTeacherAttendanceSheet(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const { classId, date, attendances } = req.body;
            if (!classId || !date || !Array.isArray(attendances)) {
                throw new ValidationError("classId, date and attendances are required");
            }
            const parsedDate = new Date(date);
            if (Number.isNaN(parsedDate.getTime()))
                throw new ValidationError("Invalid date format. Use YYYY-MM-DD");
            const result = await teacherDashboardService.saveTeacherAttendanceSheet(req.user.id, String(classId), parsedDate, attendances);
            res.json({ success: true, message: "Attendance sheet saved successfully", data: result });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to save attendance sheet", error: error.message });
        }
    }
    async getTeacherRecentAttendance(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const limitParam = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit || "");
            const limit = parseInt(limitParam || "5") || 5;
            if (limit < 1 || limit > 50)
                throw new ValidationError("Limit must be between 1 and 50");
            const data = await teacherDashboardService.getTeacherRecentAttendance(req.user.id, limit);
            res.json({ success: true, message: "Recent attendance retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve recent attendance", error: error.message });
        }
    }
    async getTeacherExams(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
            const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
            const subjectIdParam = String(Array.isArray(req.query.subjectId) ? req.query.subjectId[0] : req.query.subjectId || "");
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            if (page < 1)
                throw new ValidationError("Page must be greater than 0");
            if (pageSize < 1 || pageSize > 100)
                throw new ValidationError("PageSize must be between 1 and 100");
            const data = await teacherDashboardService.getTeacherExams(req.user.id, page, pageSize, statusParam || undefined, classIdParam || undefined, subjectIdParam || undefined);
            res.json({ success: true, message: "Teacher exams retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve teacher exams", error: error.message });
        }
    }
    async createTeacherExam(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const { name, classId, subjectId, date, duration, totalMarks, type, status } = req.body;
            if (!name || !classId || !subjectId || !date || !duration || !totalMarks || !type) {
                throw new ValidationError("name, classId, subjectId, date, duration, totalMarks and type are required");
            }
            const parsedDate = new Date(date);
            if (Number.isNaN(parsedDate.getTime()))
                throw new ValidationError("Invalid date format. Use YYYY-MM-DD");
            const exam = await teacherDashboardService.createTeacherExam(req.user.id, {
                name,
                classId,
                subjectId,
                date: parsedDate,
                duration,
                totalMarks: Number(totalMarks),
                type,
                status,
            });
            res.status(201).json({ success: true, message: "Exam created successfully", data: exam });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to create exam", error: error.message });
        }
    }
    async uploadTeacherQuestionPaper(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const examId = String(req.params.examId || "");
            const { fileUrl } = req.body;
            if (!examId || !fileUrl)
                throw new ValidationError("examId and fileUrl are required");
            const result = await teacherDashboardService.uploadTeacherQuestionPaper(req.user.id, examId, String(fileUrl));
            res.status(201).json({ success: true, message: "Question paper uploaded successfully", data: result });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to upload question paper", error: error.message });
        }
    }
    async getTeacherNotices(req, res) {
        try {
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const categoryParam = String(Array.isArray(req.query.category) ? req.query.category[0] : req.query.category || "");
            const sortByParam = String(Array.isArray(req.query.sortBy) ? req.query.sortBy[0] : req.query.sortBy || "");
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            const sortBy = (sortByParam || "recent");
            if (page < 1)
                throw new ValidationError("Page must be greater than 0");
            if (pageSize < 1 || pageSize > 100)
                throw new ValidationError("PageSize must be between 1 and 100");
            if (!["recent", "oldest", "pinned"].includes(sortBy)) {
                throw new ValidationError("sortBy must be one of recent, oldest, pinned");
            }
            const data = await teacherDashboardService.getTeacherNotices(page, pageSize, categoryParam || undefined, sortBy);
            res.json({ success: true, message: "Teacher notices retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve teacher notices", error: error.message });
        }
    }
    async createTeacherNotice(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const { title, message, category, priority, pinned } = req.body;
            if (!title || !message || !category)
                throw new ValidationError("title, message and category are required");
            const notice = await teacherDashboardService.createTeacherNotice(req.user.id, {
                title,
                message,
                category,
                priority,
                pinned,
            });
            res.status(201).json({ success: true, message: "Notice created successfully", data: notice });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to create teacher notice", error: error.message });
        }
    }
}
export const teacherDashboardController = new TeacherDashboardController();
//# sourceMappingURL=teacher-dashboard.controller.js.map