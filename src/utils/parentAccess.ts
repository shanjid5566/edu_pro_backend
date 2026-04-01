import { prisma } from "../lib/prisma.js";

export async function assertParentStudentAccess(
  parentId: string,
  studentId: string
): Promise<void> {
  const parentStudent = await (prisma as any).parentStudent.findFirst({
    where: {
      parentId,
      studentId,
    },
  });

  if (!parentStudent) {
    throw new Error("Unauthorized: Child not found for this parent");
  }
}

export async function getStudentClassId(studentId: string): Promise<string> {
  const student = await (prisma as any).student.findUnique({
    where: { id: studentId },
    select: { classId: true },
  });

  if (!student?.classId) {
    throw new Error("Student not found");
  }

  return student.classId;
}
