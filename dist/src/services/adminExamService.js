"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
class AdminExamService {
    /**
     * Get all exams with pagination, search, and filters - OPTIMIZED
     */
    async getAllExams(options) {
        try {
            const { skip, take, search, classId, status } = options;
            // Enforce max limit of 100 records
            const actualTake = Math.min(take, 100);
            // Build where clause
            const where = {};
            if (search) {
                where.OR = [{ name: { contains: search, mode: "insensitive" } }];
            }
            if (classId) {
                where.classId = classId;
            }
            if (status) {
                where.status = status;
            }
            const [exams, total] = await Promise.all([
                prisma_1.prisma.exam.findMany({
                    where,
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        duration: true,
                        totalMarks: true,
                        type: true,
                        status: true,
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
                            },
                        },
                        _count: {
                            select: {
                                results: true,
                            },
                        },
                    },
                    skip,
                    take: actualTake,
                    orderBy: { date: "desc" },
                }),
                prisma_1.prisma.exam.count({ where }),
            ]);
            const examsData = exams.map((exam) => ({
                id: exam.id,
                name: exam.name,
                class: `${exam.class.name}-${exam.class.section}`,
                classId: exam.class.id,
                subject: exam.subject.name,
                subjectId: exam.subject.id,
                date: exam.date,
                duration: exam.duration,
                marks: exam.totalMarks,
                type: exam.type,
                status: exam.status,
                resultCount: exam._count.results,
            }));
            return {
                success: true,
                data: examsData,
                pagination: {
                    total,
                    skip,
                    take: actualTake,
                    pages: Math.ceil(total / actualTake),
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch exams");
        }
    }
    /**
     * Get exam details by ID - OPTIMIZED (no deep nesting)
     */
    async getExamById(examId) {
        try {
            const exam = await prisma_1.prisma.exam.findUnique({
                where: { id: examId },
                select: {
                    id: true,
                    name: true,
                    classId: true,
                    subjectId: true,
                    date: true,
                    duration: true,
                    totalMarks: true,
                    type: true,
                    status: true,
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
                        },
                    },
                    results: {
                        select: {
                            id: true,
                            studentId: true,
                            marksObtained: true,
                            grade: true,
                            remarks: true,
                            student: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                        take: 100,
                    },
                    questionPapers: {
                        select: {
                            id: true,
                            teacherId: true,
                            fileUrl: true,
                            status: true,
                            createdAt: true,
                            teacher: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                        take: 50,
                    },
                },
            });
            if (!exam) {
                return {
                    success: false,
                    message: "Exam not found",
                };
            }
            return {
                success: true,
                data: {
                    id: exam.id,
                    name: exam.name,
                    classId: exam.classId,
                    class: `${exam.class.name}-${exam.class.section}`,
                    subjectId: exam.subjectId,
                    subject: exam.subject.name,
                    date: exam.date,
                    duration: exam.duration,
                    totalMarks: exam.totalMarks,
                    type: exam.type,
                    status: exam.status,
                    results: exam.results.map((result) => ({
                        id: result.id,
                        studentId: result.studentId,
                        studentName: result.student.user.name,
                        marksObtained: result.marksObtained,
                        grade: result.grade,
                        remarks: result.remarks,
                    })),
                    questionPapers: exam.questionPapers.map((paper) => ({
                        id: paper.id,
                        teacherId: paper.teacherId,
                        teacherName: paper.teacher.user.name,
                        fileUrl: paper.fileUrl,
                        status: paper.status,
                        createdAt: paper.createdAt,
                    })),
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch exam details");
        }
    }
    /**
     * Create new exam
     */
    async createExam(payload) {
        try {
            const { name, classId, subjectId, date, duration, totalMarks, type } = payload;
            // Validation
            if (!name ||
                !classId ||
                !subjectId ||
                !date ||
                !duration ||
                !totalMarks ||
                !type) {
                return {
                    success: false,
                    message: "All fields are required",
                };
            }
            // Check if class exists
            const classExists = await prisma_1.prisma.class.findUnique({
                where: { id: classId },
            });
            if (!classExists) {
                return {
                    success: false,
                    message: "Class not found",
                };
            }
            // Check if subject exists
            const subjectExists = await prisma_1.prisma.subject.findUnique({
                where: { id: subjectId },
            });
            if (!subjectExists) {
                return {
                    success: false,
                    message: "Subject not found",
                };
            }
            const exam = await prisma_1.prisma.exam.create({
                data: {
                    name,
                    classId,
                    subjectId,
                    date: new Date(date),
                    duration,
                    totalMarks,
                    type,
                    status: "UPCOMING",
                },
                select: {
                    id: true,
                    name: true,
                    classId: true,
                    subjectId: true,
                    date: true,
                    duration: true,
                    totalMarks: true,
                    type: true,
                    status: true,
                },
            });
            return {
                success: true,
                message: "Exam created successfully",
                data: exam,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to create exam",
            };
        }
    }
    /**
     * Update exam
     */
    async updateExam(examId, payload) {
        try {
            const { name, classId, subjectId, date, duration, totalMarks, type, status } = payload;
            // Check if exam exists
            const examExists = await prisma_1.prisma.exam.findUnique({
                where: { id: examId },
            });
            if (!examExists) {
                return {
                    success: false,
                    message: "Exam not found",
                };
            }
            // If classId is being changed, verify it exists
            if (classId) {
                const classExists = await prisma_1.prisma.class.findUnique({
                    where: { id: classId },
                });
                if (!classExists) {
                    return {
                        success: false,
                        message: "Class not found",
                    };
                }
            }
            // If subjectId is being changed, verify it exists
            if (subjectId) {
                const subjectExists = await prisma_1.prisma.subject.findUnique({
                    where: { id: subjectId },
                });
                if (!subjectExists) {
                    return {
                        success: false,
                        message: "Subject not found",
                    };
                }
            }
            const updateData = {};
            if (name)
                updateData.name = name;
            if (classId)
                updateData.classId = classId;
            if (subjectId)
                updateData.subjectId = subjectId;
            if (date)
                updateData.date = new Date(date);
            if (duration)
                updateData.duration = duration;
            if (totalMarks)
                updateData.totalMarks = totalMarks;
            if (type)
                updateData.type = type;
            if (status)
                updateData.status = status;
            const exam = await prisma_1.prisma.exam.update({
                where: { id: examId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    classId: true,
                    subjectId: true,
                    date: true,
                    duration: true,
                    totalMarks: true,
                    type: true,
                    status: true,
                },
            });
            return {
                success: true,
                message: "Exam updated successfully",
                data: exam,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to update exam",
            };
        }
    }
    /**
     * Delete exam
     */
    async deleteExam(examId) {
        try {
            const examExists = await prisma_1.prisma.exam.findUnique({
                where: { id: examId },
            });
            if (!examExists) {
                return {
                    success: false,
                    message: "Exam not found",
                };
            }
            await prisma_1.prisma.exam.delete({
                where: { id: examId },
            });
            return {
                success: true,
                message: "Exam deleted successfully",
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to delete exam",
            };
        }
    }
    /**
     * Search exams
     */
    async searchExams(query, limit = 10) {
        try {
            const actualLimit = Math.min(limit, 100);
            const exams = await prisma_1.prisma.exam.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { subject: { name: { contains: query, mode: "insensitive" } } },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    date: true,
                    status: true,
                    class: { select: { id: true, name: true } },
                    subject: { select: { id: true, name: true } },
                },
                take: actualLimit,
            });
            return { success: true, data: exams };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to search exams",
            };
        }
    }
    /**
     * Get exams by class
     */
    async getExamsByClass(classId) {
        try {
            const exams = await prisma_1.prisma.exam.findMany({
                where: { classId },
                select: {
                    id: true,
                    name: true,
                    date: true,
                    duration: true,
                    totalMarks: true,
                    status: true,
                    subject: { select: { id: true, name: true } },
                },
                orderBy: { date: "desc" },
                take: 100,
            });
            return { success: true, data: exams };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to fetch exams",
            };
        }
    }
    /**
     * Get exams by status
     */
    async getExamsByStatus(status, limit = 10) {
        try {
            const actualLimit = Math.min(limit, 100);
            const validStatus = ["UPCOMING", "ONGOING", "COMPLETED"];
            const safeStatus = validStatus.includes(status) ? status : "UPCOMING";
            const exams = await prisma_1.prisma.exam.findMany({
                where: { status: safeStatus },
                select: {
                    id: true,
                    name: true,
                    date: true,
                    status: true,
                    class: { select: { name: true, section: true } },
                    subject: { select: { name: true } },
                },
                take: actualLimit,
                orderBy: { date: "desc" },
            });
            return { success: true, data: exams };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to fetch exams",
            };
        }
    }
    /**
     * Get exam statistics
     */
    async getExamStatistics() {
        try {
            const stats = await prisma_1.prisma.exam.groupBy({
                by: ["status"],
                _count: true,
            });
            const result = {
                upcoming: 0,
                ongoing: 0,
                completed: 0,
            };
            stats.forEach((stat) => {
                if (stat.status === "UPCOMING")
                    result.upcoming = stat._count;
                if (stat.status === "ONGOING")
                    result.ongoing = stat._count;
                if (stat.status === "COMPLETED")
                    result.completed = stat._count;
            });
            return { success: true, data: result };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to fetch statistics",
            };
        }
    }
}
exports.default = new AdminExamService();
