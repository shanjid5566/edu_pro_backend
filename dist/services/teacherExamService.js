"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
class TeacherExamService {
    // Get all exams for teacher's classes
    async getMyExams(teacherId) {
        try {
            const exams = await prisma_js_1.prisma.exam.findMany({
                where: {
                    class: {
                        teachers: {
                            some: { teacherId },
                        },
                    },
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
                    _count: {
                        select: {
                            results: true,
                        },
                    },
                },
                orderBy: { date: "desc" },
            });
            // Group exams by status
            const upcoming = exams.filter((e) => e.status === "UPCOMING");
            const ongoing = exams.filter((e) => e.status === "ONGOING");
            const completed = exams.filter((e) => e.status === "COMPLETED");
            // Fetch class and subject details
            const classDetails = await prisma_js_1.prisma.class.findMany({
                where: { id: { in: exams.map((e) => e.classId) } },
                select: { id: true, name: true, section: true },
            });
            const subjectDetails = await prisma_js_1.prisma.subject.findMany({
                where: { id: { in: exams.map((e) => e.subjectId) } },
                select: { id: true, name: true },
            });
            const classMap = Object.fromEntries(classDetails.map((c) => [c.id, c]));
            const subjectMap = Object.fromEntries(subjectDetails.map((s) => [s.id, s]));
            return {
                success: true,
                data: {
                    exams: exams.map((exam) => ({
                        id: exam.id,
                        name: exam.name,
                        class: `${classMap[exam.classId]?.name}-${classMap[exam.classId]?.section}`,
                        classId: exam.classId,
                        subject: subjectMap[exam.subjectId]?.name,
                        date: exam.date.toISOString().split("T")[0],
                        totalMarks: exam.totalMarks,
                        type: exam.type,
                        status: exam.status,
                        duration: exam.duration,
                        resultsCount: exam._count.results,
                    })),
                    summary: {
                        total: exams.length,
                        upcoming: upcoming.length,
                        ongoing: ongoing.length,
                        completed: completed.length,
                    },
                },
            };
        }
        catch (error) {
            console.error("Error fetching exams:", error);
            throw error;
        }
    }
    // Get exams for a specific class
    async getClassExams(teacherId, classId) {
        try {
            // Verify teacher is assigned to this class
            const teacherAssigned = await prisma_js_1.prisma.teacherClass.findFirst({
                where: { teacherId, classId },
            });
            if (!teacherAssigned) {
                throw new Error("Unauthorized - Teacher not assigned to this class");
            }
            const exams = await prisma_js_1.prisma.exam.findMany({
                where: { classId },
                select: {
                    id: true,
                    name: true,
                    date: true,
                    duration: true,
                    totalMarks: true,
                    type: true,
                    status: true,
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
                orderBy: { date: "desc" },
            });
            return {
                success: true,
                data: exams.map((exam) => ({
                    id: exam.id,
                    name: exam.name,
                    subject: exam.subject.name,
                    date: exam.date.toISOString().split("T")[0],
                    totalMarks: exam.totalMarks,
                    type: exam.type,
                    status: exam.status,
                    duration: exam.duration,
                    resultsCount: exam._count.results,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching class exams:", error);
            throw error;
        }
    }
    // Get specific exam details
    async getExamDetails(teacherId, examId) {
        try {
            const exam = await prisma_js_1.prisma.exam.findUnique({
                where: { id: examId },
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
                            students: { select: { id: true } },
                            teachers: {
                                select: {
                                    teacher: {
                                        select: { id: true, user: { select: { name: true } } },
                                    },
                                },
                            },
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
                            marksObtained: true,
                            student: {
                                select: {
                                    id: true,
                                    rollNumber: true,
                                    user: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            });
            if (!exam) {
                throw new Error("Exam not found");
            }
            // Verify teacher is assigned to this class
            const isTeacherAssigned = exam.class.teachers.some((tc) => tc.teacher.id === teacherId);
            if (!isTeacherAssigned) {
                throw new Error("Unauthorized - Teacher not assigned to this class");
            }
            return {
                success: true,
                data: {
                    id: exam.id,
                    name: exam.name,
                    class: `${exam.class.name}-${exam.class.section}`,
                    classId: exam.class.id,
                    subject: exam.subject.name,
                    date: exam.date.toISOString().split("T")[0],
                    totalMarks: exam.totalMarks,
                    type: exam.type,
                    status: exam.status,
                    duration: exam.duration,
                    totalStudents: exam.class.students.length,
                    markedStudents: exam.results.filter((r) => r.marksObtained !== null).length,
                    results: exam.results.map((result) => ({
                        id: result.id,
                        studentName: result.student.user.name,
                        rollNumber: result.student.rollNumber,
                        marksObtained: result.marksObtained,
                    })),
                },
            };
        }
        catch (error) {
            console.error("Error fetching exam details:", error);
            throw error;
        }
    }
    // Get exams by status
    async getExamsByStatus(teacherId, status) {
        try {
            const exams = await prisma_js_1.prisma.exam.findMany({
                where: {
                    status: status.toUpperCase(),
                    class: {
                        teachers: {
                            some: { teacherId },
                        },
                    },
                },
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
                orderBy: { date: "desc" },
            });
            return {
                success: true,
                data: exams.map((exam) => ({
                    id: exam.id,
                    name: exam.name,
                    class: `${exam.class.name}-${exam.class.section}`,
                    classId: exam.class.id,
                    subject: exam.subject.name,
                    date: exam.date.toISOString().split("T")[0],
                    totalMarks: exam.totalMarks,
                    type: exam.type,
                    status: exam.status,
                    duration: exam.duration,
                    resultsCount: exam._count.results,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching exams by status:", error);
            throw error;
        }
    }
    // Submit exam marks for students
    async submitExamMarks(teacherId, examId, marks) {
        try {
            const exam = await prisma_js_1.prisma.exam.findUnique({
                where: { id: examId },
                select: {
                    classId: true,
                    totalMarks: true,
                    class: {
                        select: {
                            teachers: {
                                select: { teacherId: true },
                            },
                        },
                    },
                },
            });
            if (!exam) {
                throw new Error("Exam not found");
            }
            // Verify teacher is assigned to this class
            const isTeacherAssigned = exam.class.teachers.some((tc) => tc.teacherId === teacherId);
            if (!isTeacherAssigned) {
                throw new Error("Unauthorized - Teacher not assigned to this class");
            }
            // Validate marks
            for (const mark of marks) {
                if (mark.marksObtained !== null && mark.marksObtained > exam.totalMarks) {
                    throw new Error(`Marks cannot exceed total marks (${exam.totalMarks})`);
                }
            }
            // Update marks
            const updatePromises = marks.map((mark) => prisma_js_1.prisma.examResult.upsert({
                where: {
                    examId_studentId: {
                        studentId: mark.studentId,
                        examId,
                    },
                },
                update: { marksObtained: mark.marksObtained },
                create: {
                    studentId: mark.studentId,
                    examId,
                    marksObtained: mark.marksObtained,
                },
            }));
            await Promise.all(updatePromises);
            return {
                success: true,
                message: "Exam marks submitted successfully",
                data: {
                    examId,
                    marksUpdated: marks.length,
                },
            };
        }
        catch (error) {
            console.error("Error submitting exam marks:", error);
            throw error;
        }
    }
}
exports.default = new TeacherExamService();
