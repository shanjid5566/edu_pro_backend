"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AdminTeacherService {
    /**
     * Get all teachers with pagination and filters
     */
    async getAllTeachers(options) {
        try {
            const { skip, take, search, department, status } = options;
            // Build where clause
            const where = {};
            if (search) {
                where.OR = [
                    { user: { name: { contains: search, mode: "insensitive" } } },
                    { user: { email: { contains: search, mode: "insensitive" } } },
                ];
            }
            if (department) {
                where.department = department;
            }
            if (status) {
                where.user = { ...where.user, status };
            }
            const [teachers, total] = await Promise.all([
                prisma_1.prisma.teacher.findMany({
                    where,
                    select: {
                        id: true,
                        department: true,
                        joinDate: true,
                        classesTaken: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                status: true,
                            },
                        },
                        subjects: {
                            select: {
                                subject: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        classes: {
                            select: {
                                class: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        classTeacherOf: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    skip,
                    take,
                    orderBy: { user: { name: "asc" } },
                }),
                prisma_1.prisma.teacher.count({ where }),
            ]);
            const teachersData = teachers.map((teacher) => ({
                id: teacher.id,
                name: teacher.user.name,
                email: teacher.user.email,
                phone: teacher.user.phone,
                department: teacher.department,
                joinDate: teacher.joinDate,
                classesTaken: teacher.classesTaken,
                subjects: teacher.subjects.map((s) => s.subject.name).join(", "),
                classesAssigned: teacher.classes.length,
                status: teacher.user.status,
            }));
            return {
                success: true,
                data: teachersData,
                pagination: {
                    total,
                    skip,
                    take,
                    pages: Math.ceil(total / take),
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch teachers");
        }
    }
    /**
     * Get teacher profile by ID
     */
    async getTeacherById(teacherId) {
        try {
            const teacher = await prisma_1.prisma.teacher.findUnique({
                where: { id: teacherId },
                include: {
                    user: true,
                    subjects: {
                        include: {
                            subject: true,
                        },
                    },
                    classes: {
                        include: {
                            class: true,
                        },
                    },
                    classTeacherOf: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            if (!teacher) {
                return {
                    success: false,
                    message: "Teacher not found",
                };
            }
            return {
                success: true,
                data: {
                    id: teacher.id,
                    name: teacher.user.name,
                    email: teacher.user.email,
                    phone: teacher.user.phone,
                    department: teacher.department,
                    joinDate: teacher.joinDate,
                    classesTaken: teacher.classesTaken,
                    subjects: teacher.subjects.map((s) => ({
                        id: s.subject.id,
                        name: s.subject.name,
                    })),
                    classesAssigned: teacher.classes.map((c) => ({
                        id: c.class.id,
                        name: c.class.name,
                    })),
                    classTeacherOf: teacher.classTeacherOf.map((c) => ({
                        id: c.id,
                        name: c.name,
                    })),
                    status: teacher.user.status,
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch teacher details");
        }
    }
    /**
     * Create new teacher
     */
    async createTeacher(payload) {
        try {
            // Check if email already exists
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email: payload.email },
            });
            if (existingUser) {
                return {
                    success: false,
                    message: "Email already exists",
                };
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(payload.password, 10);
            // Create user first
            const user = await prisma_1.prisma.user.create({
                data: {
                    email: payload.email,
                    name: payload.fullName,
                    phone: payload.phone,
                    password: hashedPassword,
                    role: "TEACHER",
                    status: "active",
                },
            });
            // Create teacher record
            const teacher = await prisma_1.prisma.teacher.create({
                data: {
                    userId: user.id,
                    department: payload.department,
                    joinDate: payload.joinDate,
                },
            });
            // Assign subjects if provided
            if (payload.subjects && payload.subjects.length > 0) {
                try {
                    await Promise.all(payload.subjects.map((subjectId) => prisma_1.prisma.teacherSubject.create({
                        data: {
                            teacherId: teacher.id,
                            subjectId,
                        },
                    })));
                }
                catch (error) {
                    console.log("Warning: Failed to assign subjects - IDs may not exist");
                }
            }
            // Assign classes if provided
            if (payload.assignClasses && payload.assignClasses.length > 0) {
                try {
                    await Promise.all(payload.assignClasses.map((classId) => prisma_1.prisma.teacherClass.create({
                        data: {
                            teacherId: teacher.id,
                            classId,
                        },
                    })));
                }
                catch (error) {
                    console.log("Warning: Failed to assign classes - IDs may not exist");
                }
            }
            return {
                success: true,
                message: "Teacher created successfully",
                data: {
                    id: teacher.id,
                    name: payload.fullName,
                    email: payload.email,
                    password: payload.password,
                    department: payload.department,
                    joinDate: payload.joinDate,
                },
            };
        }
        catch (error) {
            if (error.code === "P2002") {
                return {
                    success: false,
                    message: "Email already exists",
                };
            }
            throw new Error("Failed to create teacher");
        }
    }
    /**
     * Update teacher
     */
    async updateTeacher(teacherId, payload) {
        try {
            const teacher = await prisma_1.prisma.teacher.findUnique({
                where: { id: teacherId },
            });
            if (!teacher) {
                return {
                    success: false,
                    message: "Teacher not found",
                };
            }
            // Update user data if provided
            if (payload.fullName || payload.email || payload.phone) {
                await prisma_1.prisma.user.update({
                    where: { id: teacher.userId },
                    data: {
                        ...(payload.fullName && { name: payload.fullName }),
                        ...(payload.email && { email: payload.email }),
                        ...(payload.phone && { phone: payload.phone }),
                    },
                });
            }
            // Update teacher data
            const updateData = {};
            if (payload.department)
                updateData.department = payload.department;
            if (payload.joinDate)
                updateData.joinDate = payload.joinDate;
            const updated = await prisma_1.prisma.teacher.update({
                where: { id: teacherId },
                data: updateData,
                include: { user: true },
            });
            // Update subjects if provided
            if (payload.subjects) {
                // Delete existing subjects
                await prisma_1.prisma.teacherSubject.deleteMany({
                    where: { teacherId },
                });
                // Add new subjects
                if (payload.subjects.length > 0) {
                    await Promise.all(payload.subjects.map((subjectId) => prisma_1.prisma.teacherSubject.create({
                        data: {
                            teacherId,
                            subjectId,
                        },
                    })));
                }
            }
            // Update classes if provided
            if (payload.assignClasses) {
                // Delete existing classes
                await prisma_1.prisma.teacherClass.deleteMany({
                    where: { teacherId },
                });
                // Add new classes
                if (payload.assignClasses.length > 0) {
                    await Promise.all(payload.assignClasses.map((classId) => prisma_1.prisma.teacherClass.create({
                        data: {
                            teacherId,
                            classId,
                        },
                    })));
                }
            }
            return {
                success: true,
                message: "Teacher updated successfully",
                data: {
                    id: updated.id,
                    name: updated.user.name,
                    email: updated.user.email,
                    department: updated.department,
                },
            };
        }
        catch (error) {
            throw new Error("Failed to update teacher");
        }
    }
    /**
     * Delete teacher
     */
    async deleteTeacher(teacherId) {
        try {
            const teacher = await prisma_1.prisma.teacher.findUnique({
                where: { id: teacherId },
            });
            if (!teacher) {
                return {
                    success: false,
                    message: "Teacher not found",
                };
            }
            // Delete related records due to cascade
            await prisma_1.prisma.teacher.delete({
                where: { id: teacherId },
            });
            // Delete user
            await prisma_1.prisma.user.delete({
                where: { id: teacher.userId },
            });
            return {
                success: true,
                message: "Teacher deleted successfully",
            };
        }
        catch (error) {
            throw new Error("Failed to delete teacher");
        }
    }
    /**
     * Get teachers by department
     */
    async getTeachersByDepartment(department) {
        try {
            const teachers = await prisma_1.prisma.teacher.findMany({
                where: { department },
                include: {
                    user: true,
                    subjects: {
                        include: {
                            subject: true,
                        },
                    },
                    classes: {
                        include: {
                            class: true,
                        },
                    },
                },
                orderBy: { user: { name: "asc" } },
            });
            return {
                success: true,
                data: teachers.map((t) => ({
                    id: t.id,
                    name: t.user.name,
                    email: t.user.email,
                    phone: t.user.phone,
                    department: t.department,
                    subjects: t.subjects.map((s) => s.subject.name),
                    classes: t.classes.map((c) => c.class.name),
                })),
            };
        }
        catch (error) {
            throw new Error("Failed to fetch teachers by department");
        }
    }
    /**
     * Search teachers
     */
    async searchTeachers(query, limit = 10) {
        try {
            const teachers = await prisma_1.prisma.teacher.findMany({
                where: {
                    OR: [
                        { user: { name: { contains: query, mode: "insensitive" } } },
                        { user: { email: { contains: query, mode: "insensitive" } } },
                        { department: { contains: query, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    department: true,
                    user: { select: { name: true, email: true } },
                    subjects: {
                        select: {
                            subject: { select: { name: true } },
                        },
                    },
                },
                take: limit,
            });
            return {
                success: true,
                data: teachers,
            };
        }
        catch (error) {
            throw new Error("Failed to search teachers");
        }
    }
    /**
     * Export teachers to CSV format
     */
    async exportTeachersToCSV(options) {
        try {
            const { search, department, status } = options;
            // Build where clause
            const where = {};
            if (search) {
                where.OR = [
                    { user: { name: { contains: search, mode: "insensitive" } } },
                    { user: { email: { contains: search, mode: "insensitive" } } },
                ];
            }
            if (department) {
                where.department = department;
            }
            if (status) {
                where.user = { ...where.user, status };
            }
            const teachers = await prisma_1.prisma.teacher.findMany({
                where,
                include: {
                    user: true,
                    subjects: {
                        include: {
                            subject: true,
                        },
                    },
                    classes: {
                        include: {
                            class: true,
                        },
                    },
                },
                orderBy: { user: { name: "asc" } },
            });
            // Prepare CSV data
            const csvData = teachers.map((teacher) => ({
                name: teacher.user.name,
                email: teacher.user.email,
                phone: teacher.user.phone,
                department: teacher.department,
                joinDate: teacher.joinDate.toISOString().split("T")[0],
                subjects: teacher.subjects.map((s) => s.subject.name).join("; "),
                classesAssigned: teacher.classes.map((c) => c.class.name).join("; "),
                classesTaken: teacher.classesTaken,
                status: teacher.user.status,
            }));
            // Generate CSV headers
            const headers = [
                "Name",
                "Email",
                "Phone",
                "Department",
                "Join Date",
                "Subjects",
                "Classes Assigned",
                "Classes Taken",
                "Status",
            ];
            // Convert to CSV string
            let csv = headers.join(",") + "\n";
            csvData.forEach((row) => {
                const values = [
                    `"${row.name}"`,
                    `"${row.email}"`,
                    `"${row.phone}"`,
                    `"${row.department}"`,
                    row.joinDate,
                    `"${row.subjects}"`,
                    `"${row.classesAssigned}"`,
                    row.classesTaken,
                    row.status,
                ];
                csv += values.join(",") + "\n";
            });
            return {
                success: true,
                data: csv,
            };
        }
        catch (error) {
            throw new Error("Failed to export teachers to CSV");
        }
    }
    /**
     * Get all departments
     */
    async getAllDepartments() {
        try {
            const teachers = await prisma_1.prisma.teacher.findMany({
                select: {
                    department: true,
                },
                distinct: ["department"],
                orderBy: { department: "asc" },
            });
            const departments = teachers.map((t) => t.department);
            return {
                success: true,
                data: departments,
            };
        }
        catch (error) {
            throw new Error("Failed to fetch departments");
        }
    }
}
exports.default = new AdminTeacherService();
