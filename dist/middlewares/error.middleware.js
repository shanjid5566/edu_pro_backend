import { AppError } from "../utils/errors.js";
import { ApiResponse } from "../utils/response.js";
import { config } from "../config/env.config.js";
/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Default error values
    let statusCode = 500;
    let message = "Internal Server Error";
    let error = null;
    // Handle AppError instances
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        // Include stack trace in development
        if (config.NODE_ENV === "development") {
            error = {
                code: err.code,
                stack: err.stack,
            };
        }
    }
    else {
        // Handle other errors
        message = err.message || message;
        if (config.NODE_ENV === "development") {
            error = {
                stack: err.stack,
            };
        }
    }
    // Log error
    console.error("Error:", {
        statusCode,
        message,
        path: req.path,
        method: req.method,
        stack: err.stack,
    });
    // Send error response
    return ApiResponse.error(res, message, statusCode, error);
};
/**
 * Handle 404 - Route not found
 */
export const notFoundHandler = (req, res, next) => {
    const message = `Route ${req.originalUrl} not found`;
    next(new AppError(message, 404));
};
/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=error.middleware.js.map