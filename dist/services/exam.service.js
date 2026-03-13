import { db } from "../config/database.config";
import { BadRequestError, NotFoundError } from "../utils/errors";
export class ExamService {
    /**
     * Create a new exam
     */
    async createExam(input) {
        // Validate required fields
        if (!input.name || !input.name.trim()) {
            throw new BadRequestError("Exam name is required");
        }
        if (!input.classId || !input.classId.trim()) {
            throw new BadRequestError("Class ID is required");
        }
        if (!input.subjectId || !input.subjectId.trim()) {
            throw new BadRequestError("Subject ID is required");
        }
        if (!input.date) {
            throw new BadRequestError("Date is required");
        }
        if (!input.duration || !input.duration.trim()) {
            throw new BadRequestError("Duration is required");
        }
        if (!input.totalMarks || input.totalMarks <= 0) {
            throw new BadRequestError("Total marks must be greater than 0");
        }
        if (!input.type) {
            throw new BadRequestError("Exam type is required");
        }
        const validTypes = ["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"];
        if (!validTypes.includes(input.type)) {
            throw new BadRequestError(`Invalid exam type. Must be one of: ${validTypes.join(", ")}`);
        }
        // Check if class exists
        const classRecord = await db.class.findUnique({
            where: { id: input.classId },
        });
        if (!classRecord) {
            throw new NotFoundError(`Class with ID ${input.classId} not found`);
        }
        // Check if subject exists
        const subject = await db.subject.findUnique({
            where: { id: input.subjectId },
        });
        if (!subject) {
            throw new NotFoundError(`Subject with ID ${input.subjectId} not found`);
        }
        const exam = await db.exam.create({
            data: {
                name: input.name.trim(),
                classId: input.classId,
                subjectId: input.subjectId,
                date: new Date(input.date),
                duration: input.duration.trim(),
                totalMarks: input.totalMarks,
                type: input.type,
                status: input.status || "UPCOMING",
            },
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        section: true,
                    },
                },
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        });
        return exam;
    }
    /**
     * Get exam by ID
     */
    async getExamById(id) {
        const exam = await db.exam.findUnique({
            where: { id },
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        section: true,
                    },
                },
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        });
        if (!exam) {
            throw new NotFoundError(`Exam with ID ${id} not found`);
        }
        return exam;
    }
    /**
     * Get all exams with pagination and filters
     */
    async getExams(page = 1, pageSize = 10, status, classId, subjectId, type, search) {
        const skip = (page - 1) * pageSize;
        // Build where clause
        const where = {};
        if (status) {
            const validStatuses = ["UPCOMING", "ONGOING", "COMPLETED"];
            if (!validStatuses.includes(status.toUpperCase())) {
                throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
            }
            where.status = status.toUpperCase();
        }
        if (classId) {
            where.classId = classId;
        }
        if (subjectId) {
            where.subjectId = subjectId;
        }
        if (type) {
            const validTypes = ["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"];
            if (!validTypes.includes(type.toUpperCase())) {
                throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(", ")}`);
            }
            where.type = type.toUpperCase();
        }
        if (search) {
            where.name = {
                contains: search.trim(),
                mode: "insensitive",
            };
        }
        const total = await db.exam.count({ where });
        const exams = await db.exam.findMany({
            where,
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        section: true,
                    },
                },
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
            skip,
            take: pageSize,
            orderBy: { date: "desc" },
        });
        return {
            exams: exams,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
    /**
     * Update exam
     */
    async updateExam(id, input) {
        // Check if exam exists
        const existing = await db.exam.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundError(`Exam with ID ${id} not found`);
        }
        // Validate inputs
        if (input.name && !input.name.trim()) {
            throw new BadRequestError("Exam name cannot be empty");
        }
        if (input.totalMarks !== undefined && input.totalMarks <= 0) {
            throw new BadRequestError("Total marks must be greater than 0");
        }
        if (input.type) {
            const validTypes = ["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"];
            if (!validTypes.includes(input.type)) {
                throw new BadRequestError(`Invalid exam type. Must be one of: ${validTypes.join(", ")}`);
            }
        }
        if (input.status) {
            const validStatuses = ["UPCOMING", "ONGOING", "COMPLETED"];
            if (!validStatuses.includes(input.status)) {
                throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
            }
        }
        // Prepare update data
        const updateData = {};
        if (input.name !== undefined) {
            updateData.name = input.name.trim();
        }
        if (input.date !== undefined) {
            updateData.date = new Date(input.date);
        }
        if (input.duration !== undefined) {
            updateData.duration = input.duration.trim();
        }
        if (input.totalMarks !== undefined) {
            updateData.totalMarks = input.totalMarks;
        }
        if (input.type !== undefined) {
            updateData.type = input.type;
        }
        if (input.status !== undefined) {
            updateData.status = input.status;
        }
        const exam = await db.exam.update({
            where: { id },
            data: updateData,
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        section: true,
                    },
                },
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        });
        return exam;
    }
    /**
     * Delete exam
     */
    async deleteExam(id) {
        const exam = await db.exam.findUnique({ where: { id } });
        if (!exam) {
            throw new NotFoundError(`Exam with ID ${id} not found`);
        }
        await db.exam.delete({ where: { id } });
    }
    /**
     * Get exam statistics
     */
    async getStatistics() {
        const exams = await db.exam.findMany({
            include: {
                class: true,
            },
        });
        const total = exams.length;
        const upcoming = exams.filter((e) => e.status === "UPCOMING").length;
        const ongoing = exams.filter((e) => e.status === "ONGOING").length;
        const completed = exams.filter((e) => e.status === "COMPLETED").length;
        // Group by class
        const classCounts = new Map();
        exams.forEach((exam) => {
            if (!classCounts.has(exam.classId)) {
                classCounts.set(exam.classId, { class: exam.class, count: 0 });
            }
            classCounts.get(exam.classId).count++;
        });
        const byClass = Array.from(classCounts.values()).map((item) => ({
            classId: item.class.id,
            className: `${item.class.name} ${item.class.section}`,
            examCount: item.count,
        }));
        // Group by type
        const typeCounts = new Map();
        exams.forEach((exam) => {
            typeCounts.set(exam.type, (typeCounts.get(exam.type) || 0) + 1);
        });
        const byType = Array.from(typeCounts.entries()).map(([type, count]) => ({
            type: type,
            count,
        }));
        return {
            total,
            upcoming,
            ongoing,
            completed,
            byClass,
            byType,
        };
    }
    /**
     * Get exam with results
     */
    async getExamWithResults(id) {
        const exam = await this.getExamById(id);
        const results = await db.examResult.findMany({
            where: { examId: id },
        });
        const totalStudents = await db.student.count({
            where: { classId: exam.classId },
        });
        const studentsAppeared = results.length;
        const totalMarksObtained = results.reduce((sum, r) => sum + r.marksObtained, 0);
        const averageMarks = studentsAppeared > 0 ? Math.round(totalMarksObtained / studentsAppeared) : 0;
        // Calculate pass percentage (assuming 40% is passing)
        const passingMarks = (exam.totalMarks * 40) / 100;
        const passCount = results.filter((r) => r.marksObtained >= passingMarks).length;
        const passPercentage = studentsAppeared > 0 ? Math.round((passCount / studentsAppeared) * 100) : 0;
        return {
            exam,
            totalStudents,
            studentsAppeared,
            averageMarks,
            passPercentage,
        };
    }
    /**
     * Bulk create exams
     */
    async bulkCreateExams(input) {
        let successful = 0;
        let failed = 0;
        const errors = [];
        for (let i = 0; i < input.exams.length; i++) {
            try {
                await this.createExam(input.exams[i]);
                successful++;
            }
            catch (error) {
                failed++;
                errors.push({
                    index: i,
                    error: error.message || "Failed to create exam",
                });
            }
        }
        return {
            total: successful + failed,
            successful,
            failed,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    /**
     * Get exams by class
     */
    async getExamsByClass(classId, page = 1, pageSize = 10) {
        return this.getExams(page, pageSize, undefined, classId);
    }
    /**
     * Get exams by subject
     */
    async getExamsBySubject(subjectId, page = 1, pageSize = 10) {
        return this.getExams(page, pageSize, undefined, undefined, subjectId);
    }
    /**
     * Search exams
     */
    async searchExams(query, page = 1, pageSize = 10) {
        if (!query || !query.trim()) {
            throw new BadRequestError("Search query cannot be empty");
        }
        return this.getExams(page, pageSize, undefined, undefined, undefined, undefined, query);
    }
}
export const examService = new ExamService();
//# sourceMappingURL=exam.service.js.map