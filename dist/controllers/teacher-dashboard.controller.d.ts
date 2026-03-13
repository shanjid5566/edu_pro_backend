import { Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}
export declare class TeacherDashboardController {
    getTeacherDashboard(req: Request, res: Response): Promise<void>;
    getTeacherClasses(req: Request, res: Response): Promise<void>;
    getTeacherSchedule(req: Request, res: Response): Promise<void>;
    getTeacherAttendanceSheet(req: Request, res: Response): Promise<void>;
    saveTeacherAttendanceSheet(req: Request, res: Response): Promise<void>;
    getTeacherRecentAttendance(req: Request, res: Response): Promise<void>;
    getTeacherExams(req: Request, res: Response): Promise<void>;
    createTeacherExam(req: Request, res: Response): Promise<void>;
    uploadTeacherQuestionPaper(req: Request, res: Response): Promise<void>;
    getTeacherNotices(req: Request, res: Response): Promise<void>;
    createTeacherNotice(req: Request, res: Response): Promise<void>;
}
export declare const teacherDashboardController: TeacherDashboardController;
//# sourceMappingURL=teacher-dashboard.controller.d.ts.map