"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertParentStudentAccess = assertParentStudentAccess;
exports.getStudentClassId = getStudentClassId;
const prisma_js_1 = require("../lib/prisma.js");
async function assertParentStudentAccess(parentId, studentId) {
    const parentStudent = await prisma_js_1.prisma.parentStudent.findFirst({
        where: {
            parentId,
            studentId,
        },
    });
    if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
    }
}
async function getStudentClassId(studentId) {
    const student = await prisma_js_1.prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
    });
    if (!student?.classId) {
        throw new Error("Student not found");
    }
    return student.classId;
}
