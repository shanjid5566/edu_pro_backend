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
export declare class StudentDashboardController {
    getStudentDashboard(req: Request, res: Response): Promise<void>;
    getStudentClasses(req: Request, res: Response): Promise<void>;
    getStudentExams(req: Request, res: Response): Promise<void>;
    getStudentResults(req: Request, res: Response): Promise<void>;
    getStudentFees(req: Request, res: Response): Promise<void>;
    getStudentNotices(req: Request, res: Response): Promise<void>;
    createStudentNotice(req: Request, res: Response): Promise<void>;
}
export declare const studentDashboardController: StudentDashboardController;
//# sourceMappingURL=student-dashboard.controller.d.ts.map