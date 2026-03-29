"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
class AdminClassService {
    /**
     * Get all classes with pagination and search
     */
    async getAllClasses(options) {
        try {
            const { skip, take, search } = options;
            // Build where clause
            const where = {};
            if (search) {
                where.OR = [{ name: { contains: search, mode: "insensitive" } }];
            }
            const [classes, total] = await Promise.all([
                prisma_1.prisma.class.findMany({
                    where,
                    select: {
                        id: true,
                        name: true,
                        section: true,
                        capacity: true,
                        classTeacher: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                students: true,
                                subjects: true,
                            },
                        },
                    },
                    skip,
                    take,
                    orderBy: { name: "asc" },
                }),
                prisma_1.prisma.class.count({ where }),
            ]);
            const classesData = classes.map((cls) => ({
                id: cls.id,
                name: cls.name,
                section: cls.section,
                capacity: cls.capacity,
                studentCount: cls._count.students,
                capacityPercentage: Math.round((cls._count.students / cls.capacity) * 100),
                subjectCount: cls._count.subjects,
                classTeacher: cls.classTeacher?.user.name || "N/A",
            }));
            return {
                success: true,
                data: classesData,
                pagination: {
                    total,
                    skip,
                    take,
                    pages: Math.ceil(total / take),
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch classes");
        }
    }
    /**
     * Get class details by ID
     */
    async getClassById(classId) {
        try {
            const classData = await prisma_1.prisma.class.findUnique({
                where: { id: classId },
                include: {
                    classTeacher: {
                        include: {
                            user: true,
                        },
                    },
                    students: {
                        include: {
                            user: true,
                        },
                        orderBy: { rollNumber: "asc" },
                    },
                    subjects: {
                        include: {
                            subject: true,
                        },
                    },
                    teachers: {
                        include: {
                            teacher: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!classData) {
                return {
                    success: false,
                    message: "Class not found",
                };
            }
            return {
                success: true,
                data: {
                    id: classData.id,
                    name: classData.name,
                    section: classData.section,
                    capacity: classData.capacity,
                    studentCount: classData.students.length,
                    capacityPercentage: Math.round((classData.students.length / classData.capacity) * 100),
                    classTeacher: classData.classTeacher
                        ? {
                            id: classData.classTeacher.id,
                            name: classData.classTeacher.user.name,
                            email: classData.classTeacher.user.email,
                        }
                        : null,
                    students: classData.students.map((s) => ({
                        id: s.id,
                        name: s.user.name,
                        rollNumber: s.rollNumber,
                        section: s.section,
                    })),
                    subjects: classData.subjects.map((cs) => ({
                        id: cs.subject.id,
                        name: cs.subject.name,
                        code: cs.subject.code,
                    })),
                    teachers: classData.teachers.map((tc) => ({
                        id: tc.teacher.id,
                        name: tc.teacher.user.name,
                        department: tc.teacher.department,
                    })),
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch class details");
        }
    }
    /**
     * Create new class
     */
    async createClass(payload) {
        try {
            // Check if class already exists with same name and section
            const existingClass = await prisma_1.prisma.class.findUnique({
                where: {
                    name_section: {
                        name: payload.name,
                        section: payload.section,
                    },
                },
            });
            if (existingClass) {
                return {
                    success: false,
                    message: "Class with this name and section already exists",
                };
            }
            // Verify teacher exists if provided
            if (payload.classTeacherId) {
                const teacher = await prisma_1.prisma.teacher.findUnique({
                    where: { id: payload.classTeacherId },
                });
                if (!teacher) {
                    return {
                        success: false,
                        message: "Teacher not found",
                    };
                }
            }
            // Create class
            const newClass = await prisma_1.prisma.class.create({
                data: {
                    name: payload.name,
                    section: payload.section,
                    capacity: payload.capacity,
                    classTeacherId: payload.classTeacherId,
                },
                include: {
                    classTeacher: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: "Class created successfully",
                data: {
                    id: newClass.id,
                    name: newClass.name,
                    section: newClass.section,
                    capacity: newClass.capacity,
                    classTeacher: newClass.classTeacher?.user.name || null,
                },
            };
        }
        catch (error) {
            throw new Error("Failed to create class");
        }
    }
    /**
     * Update class
     */
    async updateClass(classId, payload) {
        try {
            const classData = await prisma_1.prisma.class.findUnique({
                where: { id: classId },
            });
            if (!classData) {
                return {
                    success: false,
                    message: "Class not found",
                };
            }
            // Verify teacher exists if classTeacherId is provided
            if (payload.classTeacherId) {
                const teacher = await prisma_1.prisma.teacher.findUnique({
                    where: { id: payload.classTeacherId },
                });
                if (!teacher) {
                    return {
                        success: false,
                        message: "Teacher not found",
                    };
                }
            }
            const updated = await prisma_1.prisma.class.update({
                where: { id: classId },
                data: {
                    ...(payload.name && { name: payload.name }),
                    ...(payload.section && { section: payload.section }),
                    ...(payload.capacity && { capacity: payload.capacity }),
                    ...(payload.classTeacherId && {
                        classTeacherId: payload.classTeacherId,
                    }),
                },
                include: {
                    classTeacher: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: "Class updated successfully",
                data: {
                    id: updated.id,
                    name: updated.name,
                    section: updated.section,
                    capacity: updated.capacity,
                    classTeacher: updated.classTeacher?.user.name || null,
                },
            };
        }
        catch (error) {
            throw new Error("Failed to update class");
        }
    }
    /**
     * Delete class
     */
    async deleteClass(classId) {
        try {
            const classData = await prisma_1.prisma.class.findUnique({
                where: { id: classId },
            });
            if (!classData) {
                return {
                    success: false,
                    message: "Class not found",
                };
            }
            // Delete class
            await prisma_1.prisma.class.delete({
                where: { id: classId },
            });
            return {
                success: true,
                message: "Class deleted successfully",
            };
        }
        catch (error) {
            throw new Error("Failed to delete class");
        }
    }
    /**
     * Search classes
     */
    async searchClasses(query, limit = 10) {
        try {
            const classes = await prisma_1.prisma.class.findMany({
                where: {
                    OR: [{ name: { contains: query, mode: "insensitive" } }],
                },
                select: {
                    id: true,
                    name: true,
                    section: true,
                    capacity: true,
                    classTeacher: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            students: true,
                        },
                    },
                },
                take: limit,
            });
            return {
                success: true,
                data: classes,
            };
        }
        catch (error) {
            throw new Error("Failed to search classes");
        }
    }
    /**
     * Export classes to CSV format
     */
    async exportClassesToCSV(options) {
        try {
            const { search } = options;
            const where = {};
            if (search) {
                where.OR = [{ name: { contains: search, mode: "insensitive" } }];
            }
            const classes = await prisma_1.prisma.class.findMany({
                where,
                include: {
                    classTeacher: {
                        include: {
                            user: true,
                        },
                    },
                    _count: {
                        select: {
                            students: true,
                            subjects: true,
                        },
                    },
                },
                orderBy: { name: "asc" },
            });
            // Prepare CSV data
            const csvData = classes.map((cls) => ({
                name: cls.name,
                section: cls.section,
                capacity: cls.capacity,
                studentCount: cls._count.students,
                capacityPercentage: Math.round((cls._count.students / cls.capacity) * 100),
                subjectCount: cls._count.subjects,
                classTeacher: cls.classTeacher?.user.name || "N/A",
            }));
            // Generate CSV headers
            const headers = [
                "Name",
                "Section",
                "Capacity",
                "Student Count",
                "Capacity %",
                "Subjects",
                "Class Teacher",
            ];
            // Convert to CSV string
            let csv = headers.join(",") + "\n";
            csvData.forEach((row) => {
                const values = [
                    `"${row.name}"`,
                    row.section,
                    row.capacity,
                    row.studentCount,
                    `${row.capacityPercentage}%`,
                    row.subjectCount,
                    `"${row.classTeacher}"`,
                ];
                csv += values.join(",") + "\n";
            });
            return {
                success: true,
                data: csv,
            };
        }
        catch (error) {
            throw new Error("Failed to export classes to CSV");
        }
    }
}
exports.default = new AdminClassService();
