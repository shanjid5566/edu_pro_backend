import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Profile
 *
 */
export type Profile = Prisma.ProfileModel;
/**
 * Model Student
 *
 */
export type Student = Prisma.StudentModel;
/**
 * Model Teacher
 *
 */
export type Teacher = Prisma.TeacherModel;
/**
 * Model Parent
 *
 */
export type Parent = Prisma.ParentModel;
/**
 * Model ParentStudent
 *
 */
export type ParentStudent = Prisma.ParentStudentModel;
/**
 * Model Class
 *
 */
export type Class = Prisma.ClassModel;
/**
 * Model Subject
 *
 */
export type Subject = Prisma.SubjectModel;
/**
 * Model ClassSubject
 *
 */
export type ClassSubject = Prisma.ClassSubjectModel;
/**
 * Model TeacherSubject
 *
 */
export type TeacherSubject = Prisma.TeacherSubjectModel;
/**
 * Model TeacherClass
 *
 */
export type TeacherClass = Prisma.TeacherClassModel;
/**
 * Model Attendance
 *
 */
export type Attendance = Prisma.AttendanceModel;
/**
 * Model Exam
 *
 */
export type Exam = Prisma.ExamModel;
/**
 * Model ExamResult
 *
 */
export type ExamResult = Prisma.ExamResultModel;
/**
 * Model QuestionPaper
 *
 */
export type QuestionPaper = Prisma.QuestionPaperModel;
/**
 * Model FeeStructure
 *
 */
export type FeeStructure = Prisma.FeeStructureModel;
/**
 * Model FeePayment
 *
 */
export type FeePayment = Prisma.FeePaymentModel;
/**
 * Model ChatMessage
 *
 */
export type ChatMessage = Prisma.ChatMessageModel;
/**
 * Model Notice
 *
 */
export type Notice = Prisma.NoticeModel;
/**
 * Model Notification
 *
 */
export type Notification = Prisma.NotificationModel;
/**
 * Model ActivityLog
 *
 */
export type ActivityLog = Prisma.ActivityLogModel;
/**
 * Model Setting
 *
 */
export type Setting = Prisma.SettingModel;
//# sourceMappingURL=client.d.ts.map