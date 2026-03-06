import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
/**
 * Verify JWT token middleware
 */
export declare const verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => void;
/**
 * Check if user has required role
 */
export declare const requireRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
declare const _default: {
    verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => void;
    requireRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=auth.middleware.d.ts.map