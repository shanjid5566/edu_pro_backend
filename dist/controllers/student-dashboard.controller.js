import { ValidationError } from "../utils/errors.js";
import { studentDashboardService } from "../services/student-dashboard.service.js";
export class StudentDashboardController {
    async getStudentDashboard(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const dashboard = await studentDashboardService.getStudentDashboard(req.user.id);
            res.json({ success: true, message: "Student dashboard retrieved successfully", data: dashboard });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve student dashboard", error: error.message });
        }
    }
    async getStudentClasses(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const data = await studentDashboardService.getStudentClasses(req.user.id);
            res.json({ success: true, message: "Student classes retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve student classes", error: error.message });
        }
    }
    async getStudentExams(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
            const data = await studentDashboardService.getStudentExams(req.user.id, statusParam || undefined);
            res.json({ success: true, message: "Student exams retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve student exams", error: error.message });
        }
    }
    async getStudentResults(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            if (page < 1)
                throw new ValidationError("Page must be greater than 0");
            if (pageSize < 1 || pageSize > 100)
                throw new ValidationError("PageSize must be between 1 and 100");
            const data = await studentDashboardService.getStudentResults(req.user.id, page, pageSize);
            res.json({ success: true, message: "Student results retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve student results", error: error.message });
        }
    }
    async getStudentFees(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "ALL");
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const status = (statusParam || "ALL").toUpperCase();
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "20") || 20;
            if (!["ALL", "PAID", "PENDING", "OVERDUE"].includes(status)) {
                throw new ValidationError("status must be one of ALL, PAID, PENDING, OVERDUE");
            }
            if (page < 1)
                throw new ValidationError("Page must be greater than 0");
            if (pageSize < 1 || pageSize > 200)
                throw new ValidationError("PageSize must be between 1 and 200");
            const data = await studentDashboardService.getStudentFees(req.user.id, status, page, pageSize);
            res.json({ success: true, message: "Student fees retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve student fees", error: error.message });
        }
    }
    async getStudentNotices(req, res) {
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
            const data = await studentDashboardService.getStudentNotices(page, pageSize, categoryParam || undefined, sortBy);
            res.json({ success: true, message: "Student notices retrieved successfully", data });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({ success: false, message: error.message || "Failed to retrieve student notices", error: error.message });
        }
    }
    async createStudentNotice(req, res) {
        try {
            if (!req.user?.id)
                throw new ValidationError("User authentication required");
            const { title, message, category, priority, pinned } = req.body;
            if (!title || !message || !category)
                throw new ValidationError("title, message and category are required");
            const notice = await studentDashboardService.createStudentNotice(req.user.id, {
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
            res.status(status).json({ success: false, message: error.message || "Failed to create student notice", error: error.message });
        }
    }
}
export const studentDashboardController = new StudentDashboardController();
//# sourceMappingURL=student-dashboard.controller.js.map