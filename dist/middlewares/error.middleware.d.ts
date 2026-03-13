import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
/**
 * Global error handler middleware
 */
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Handle 404 - Route not found
 */
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Async handler wrapper to catch errors
 */
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map