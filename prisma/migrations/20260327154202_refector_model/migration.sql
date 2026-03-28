/*
  Warnings:

  - You are about to drop the `activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attendances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class_subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_structures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parent_students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question_papers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teachers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_classId_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_markedBy_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_studentId_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_classTeacherId_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_examId_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_studentId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_classId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "fee_payments" DROP CONSTRAINT "fee_payments_feeStructureId_fkey";

-- DropForeignKey
ALTER TABLE "fee_payments" DROP CONSTRAINT "fee_payments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "fee_structures" DROP CONSTRAINT "fee_structures_classId_fkey";

-- DropForeignKey
ALTER TABLE "notices" DROP CONSTRAINT "notices_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "parent_students" DROP CONSTRAINT "parent_students_parentId_fkey";

-- DropForeignKey
ALTER TABLE "parent_students" DROP CONSTRAINT "parent_students_studentId_fkey";

-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_userId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "question_papers" DROP CONSTRAINT "question_papers_examId_fkey";

-- DropForeignKey
ALTER TABLE "question_papers" DROP CONSTRAINT "question_papers_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_classes" DROP CONSTRAINT "teacher_classes_classId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_classes" DROP CONSTRAINT "teacher_classes_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_subjects" DROP CONSTRAINT "teacher_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_subjects" DROP CONSTRAINT "teacher_subjects_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- DropTable
DROP TABLE "activity_logs";

-- DropTable
DROP TABLE "attendances";

-- DropTable
DROP TABLE "chat_messages";

-- DropTable
DROP TABLE "class_subjects";

-- DropTable
DROP TABLE "classes";

-- DropTable
DROP TABLE "exam_results";

-- DropTable
DROP TABLE "exams";

-- DropTable
DROP TABLE "fee_payments";

-- DropTable
DROP TABLE "fee_structures";

-- DropTable
DROP TABLE "notices";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "parent_students";

-- DropTable
DROP TABLE "parents";

-- DropTable
DROP TABLE "profiles";

-- DropTable
DROP TABLE "question_papers";

-- DropTable
DROP TABLE "settings";

-- DropTable
DROP TABLE "students";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "teacher_classes";

-- DropTable
DROP TABLE "teacher_subjects";

-- DropTable
DROP TABLE "teachers";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "ExamStatus";

-- DropEnum
DROP TYPE "ExamType";

-- DropEnum
DROP TYPE "FeeType";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "PaperStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "UserRole";
