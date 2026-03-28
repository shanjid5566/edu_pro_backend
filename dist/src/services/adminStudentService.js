"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AdminStudentService {
    /**
     * Get all students with pagination and filters
     */
    async getAllStudents(options) {
        try {
            const { skip, take, search, classId, status } = options;
            // Build where clause
            const where = {};
            if (search) {
                where.OR = [
                    { user: { name: { contains: search, mode: "insensitive" } } },
                    { user: { email: { contains: search, mode: "insensitive" } } },
                    { rollNumber: { contains: search, mode: "insensitive" } },
                ];
            }
            if (classId) {
                where.classId = classId;
            }
            if (status) {
                where.user = { ...where.user, status };
            }
            const [students, total] = await Promise.all([
                prisma_1.prisma.student.findMany({
                    where,
                    select: {
                        id: true,
                        rollNumber: true,
                        section: true,
                        grade: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                status: true,
                            },
                        },
                        class: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        attendances: {
                            select: {
                                status: true,
                            },
                            where: {
                                date: {
                                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                                },
                            },
                        },
                    },
                    skip,
                    take,
                    orderBy: { user: { name: "asc" } },
                }),
                prisma_1.prisma.student.count({ where }),
            ]);
            // Calculate attendance percentage
            const studentsWithAttendance = students.map((student) => {
                const totalAttendance = student.attendances.length;
                const presentCount = student.attendances.filter((a) => a.status === "PRESENT").length;
                const attendance = totalAttendance > 0
                    ? Math.round((presentCount / totalAttendance) * 100)
                    : 0;
                return {
                    id: student.id,
                    name: student.user.name,
                    email: student.user.email,
                    class: student.class.name,
                    section: student.section,
                    rollNumber: student.rollNumber,
                    attendance,
                    grade: student.grade || "N/A",
                    status: student.user.status,
                };
            });
            return {
                success: true,
                data: studentsWithAttendance,
                pagination: {
                    total,
                    skip,
                    take,
                    pages: Math.ceil(total / take),
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch students");
        }
    }
    /**
     * Get student profile by ID
     */
    async getStudentById(studentId) {
        try {
            const student = await prisma_1.prisma.student.findUnique({
                where: { id: studentId },
                include: {
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                    class: true,
                    parents: {
                        include: {
                            parent: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                    attendances: {
                        where: {
                            date: {
                                gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                            },
                        },
                    },
                    examResults: {
                        include: {
                            exam: true,
                        },
                        orderBy: {
                            exam: {
                                date: "desc",
                            },
                        },
                        take: 5,
                    },
                },
            });
            if (!student) {
                return {
                    success: false,
                    message: "Student not found",
                };
            }
            // Calculate attendance
            const totalAttendance = student.attendances.length;
            const presentCount = student.attendances.filter((a) => a.status === "PRESENT").length;
            const attendancePercentage = totalAttendance > 0
                ? Math.round((presentCount / totalAttendance) * 100)
                : 0;
            return {
                success: true,
                data: {
                    id: student.id,
                    name: student.user.name,
                    email: student.user.email,
                    phone: student.user.phone,
                    status: student.user.status,
                    classAndSection: `${student.class.name}-${student.section}`,
                    rollNumber: student.rollNumber,
                    grade: student.grade || "N/A",
                    attendance: attendancePercentage,
                    dateOfBirth: student.user.profile?.dateOfBirth || null,
                    gender: student.user.profile?.gender || "N/A",
                    address: student.user.profile?.address || "N/A",
                    parentName: student.parents[0]?.parent.user.name || "N/A",
                    admissionDate: student.admissionDate,
                    recentExams: student.examResults.map((result) => ({
                        examName: result.exam.name,
                        marks: result.marksObtained,
                        grade: result.grade,
                    })),
                },
            };
        }
        catch (error) {
            throw new Error("Failed to fetch student details");
        }
    }
    /**
     * Create new student
     */
    async createStudent(payload) {
        try {
            // Check if class exists
            const classExists = await prisma_1.prisma.class.findUnique({
                where: { id: payload.classId },
            });
            if (!classExists) {
                return {
                    success: false,
                    message: "Class not found",
                };
            }
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
                    role: "STUDENT",
                    status: "active",
                },
            });
            // Create student record
            const student = await prisma_1.prisma.student.create({
                data: {
                    userId: user.id,
                    classId: payload.classId,
                    section: payload.section,
                    rollNumber: payload.rollNumber,
                    grade: "N/A",
                },
            });
            // Create profile
            const validGenders = ["MALE", "FEMALE", "OTHER"];
            await prisma_1.prisma.profile.create({
                data: {
                    userId: user.id,
                    dateOfBirth: payload.dateOfBirth,
                    gender: validGenders.includes(payload.gender?.toUpperCase())
                        ? payload.gender?.toUpperCase()
                        : null,
                    address: payload.address,
                },
            });
            return {
                success: true,
                message: "Student created successfully",
                data: {
                    id: student.id,
                    name: payload.fullName,
                    email: payload.email,
                    password: payload.password,
                    class: classExists.name,
                    section: payload.section,
                    rollNumber: payload.rollNumber,
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
            throw new Error("Failed to create student");
        }
    }
    /**
     * Update student
     */
    async updateStudent(studentId, payload) {
        try {
            const student = await prisma_1.prisma.student.findUnique({
                where: { id: studentId },
            });
            if (!student) {
                return {
                    success: false,
                    message: "Student not found",
                };
            }
            // Update user data
            if (payload.fullName || payload.email || payload.phone) {
                await prisma_1.prisma.user.update({
                    where: { id: student.userId },
                    data: {
                        ...(payload.fullName && { name: payload.fullName }),
                        ...(payload.email && { email: payload.email }),
                        ...(payload.phone && { phone: payload.phone }),
                        ...(payload.status && { status: payload.status }),
                    },
                });
            }
            // Update student data
            const updateData = {};
            if (payload.classId)
                updateData.classId = payload.classId;
            if (payload.section)
                updateData.section = payload.section;
            if (payload.rollNumber)
                updateData.rollNumber = payload.rollNumber;
            if (payload.grade)
                updateData.grade = payload.grade;
            const updated = await prisma_1.prisma.student.update({
                where: { id: studentId },
                data: updateData,
                include: { user: true, class: true },
            });
            // Update profile if needed
            if (payload.dateOfBirth || payload.gender || payload.address) {
                const validGenders = ["MALE", "FEMALE", "OTHER"];
                const genderValue = payload.gender
                    ? validGenders.includes(payload.gender?.toUpperCase())
                        ? payload.gender?.toUpperCase()
                        : null
                    : undefined;
                await prisma_1.prisma.profile.upsert({
                    where: { userId: student.userId },
                    update: {
                        ...(payload.dateOfBirth && { dateOfBirth: payload.dateOfBirth }),
                        ...(genderValue !== undefined && { gender: genderValue }),
                        ...(payload.address && { address: payload.address }),
                    },
                    create: {
                        userId: student.userId,
                        dateOfBirth: payload.dateOfBirth || null,
                        gender: genderValue || null,
                        address: payload.address || null,
                    },
                });
            }
            return {
                success: true,
                message: "Student updated successfully",
                data: {
                    id: updated.id,
                    name: updated.user.name,
                    email: updated.user.email,
                    class: updated.class.name,
                    section: updated.section,
                    rollNumber: updated.rollNumber,
                },
            };
        }
        catch (error) {
            throw new Error("Failed to update student");
        }
    }
    /**
     * Delete student
     */
    async deleteStudent(studentId) {
        try {
            const student = await prisma_1.prisma.student.findUnique({
                where: { id: studentId },
            });
            if (!student) {
                return {
                    success: false,
                    message: "Student not found",
                };
            }
            // Delete related records due to cascade
            await prisma_1.prisma.student.delete({
                where: { id: studentId },
            });
            // Delete user
            await prisma_1.prisma.user.delete({
                where: { id: student.userId },
            });
            return {
                success: true,
                message: "Student deleted successfully",
            };
        }
        catch (error) {
            throw new Error("Failed to delete student");
        }
    }
    /**
     * Get students by class
     */
    async getStudentsByClass(classId) {
        try {
            const students = await prisma_1.prisma.student.findMany({
                where: { classId },
                include: {
                    user: true,
                    class: true,
                },
                orderBy: { rollNumber: "asc" },
            });
            return {
                success: true,
                data: students.map((s) => ({
                    id: s.id,
                    name: s.user.name,
                    email: s.user.email,
                    rollNumber: s.rollNumber,
                    section: s.section,
                    grade: s.grade,
                })),
            };
        }
        catch (error) {
            throw new Error("Failed to fetch class students");
        }
    }
    /**
     * Search students
     */
    async searchStudents(query, limit = 10) {
        try {
            const students = await prisma_1.prisma.student.findMany({
                where: {
                    OR: [
                        { user: { name: { contains: query, mode: "insensitive" } } },
                        { user: { email: { contains: query, mode: "insensitive" } } },
                        { rollNumber: { contains: query, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    user: { select: { name: true, email: true } },
                    rollNumber: true,
                    class: { select: { name: true } },
                },
                take: limit,
            });
            return {
                success: true,
                data: students,
            };
        }
        catch (error) {
            throw new Error("Failed to search students");
        }
    }
    /**
     * Export students to CSV format
     */
    async exportStudentsToCSV(options) {
        try {
            const { search, classId, status } = options;
            // Build where clause
            const where = {};
            if (search) {
                where.OR = [
                    { user: { name: { contains: search, mode: "insensitive" } } },
                    { user: { email: { contains: search, mode: "insensitive" } } },
                    { rollNumber: { contains: search, mode: "insensitive" } },
                ];
            }
            if (classId) {
                where.classId = classId;
            }
            if (status) {
                where.user = { ...where.user, status };
            }
            const students = await prisma_1.prisma.student.findMany({
                where,
                select: {
                    id: true,
                    rollNumber: true,
                    section: true,
                    grade: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            status: true,
                        },
                    },
                    class: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    attendances: {
                        select: {
                            status: true,
                        },
                        where: {
                            date: {
                                gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                            },
                        },
                    },
                },
                orderBy: { user: { name: "asc" } },
            });
            // Calculate attendance and prepare CSV data
            const csvData = students.map((student) => {
                const totalAttendance = student.attendances.length;
                const presentCount = student.attendances.filter((a) => a.status === "PRESENT").length;
                const attendance = totalAttendance > 0
                    ? Math.round((presentCount / totalAttendance) * 100)
                    : 0;
                return {
                    name: student.user.name,
                    email: student.user.email,
                    phone: student.user.phone,
                    class: student.class.name,
                    section: student.section,
                    rollNumber: student.rollNumber,
                    grade: student.grade || "N/A",
                    attendance: `${attendance}%`,
                    status: student.user.status,
                };
            });
            // Generate CSV headers
            const headers = [
                "Name",
                "Email",
                "Phone",
                "Class",
                "Section",
                "Roll Number",
                "Grade",
                "Attendance",
                "Status",
            ];
            // Convert to CSV string
            let csv = headers.join(",") + "\n";
            csvData.forEach((row) => {
                const values = [
                    `"${row.name}"`,
                    `"${row.email}"`,
                    `"${row.phone}"`,
                    `"${row.class}"`,
                    row.section,
                    row.rollNumber,
                    row.grade,
                    row.attendance,
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
            throw new Error("Failed to export students to CSV");
        }
    }
    /**
     * Get all classes
     */
    async getAllClasses() {
        try {
            const classes = await prisma_1.prisma.class.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            students: true,
                        },
                    },
                },
                orderBy: { name: "asc" },
            });
            return {
                success: true,
                data: classes.map((c) => ({
                    id: c.id,
                    name: c.name,
                    studentCount: c._count.students,
                })),
            };
        }
        catch (error) {
            throw new Error("Failed to fetch classes");
        }
    }
}
exports.default = new AdminStudentService();
