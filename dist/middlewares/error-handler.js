import { isProduction } from '../config/env.js';
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
function notFoundHandler(req, _res, next) {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
}
function errorHandler(err, _req, res, _next) {
    const fallback = { statusCode: 500, message: 'Internal Server Error' };
    const appError = err instanceof AppError ? err : undefined;
    const statusCode = appError?.statusCode ?? fallback.statusCode;
    const message = appError?.message ?? (err instanceof Error ? err.message : fallback.message);
    const body = { error: message };
    if (!isProduction && err instanceof Error && err.stack) {
        body.stack = err.stack;
    }
    res.status(statusCode).json(body);
}
export { AppError, errorHandler, notFoundHandler };
//# sourceMappingURL=error-handler.js.map