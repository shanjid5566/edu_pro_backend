export class AppError extends Error {
    statusCode;
    isOperational;
    code;
    constructor(message, statusCode = 500, isOperational = true, code) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends AppError {
    constructor(message = "Bad Request", code) {
        super(message, 400, true, code);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", code) {
        super(message, 401, true, code);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", code) {
        super(message, 403, true, code);
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Resource not found", code) {
        super(message, 404, true, code);
    }
}
export class ConflictError extends AppError {
    constructor(message = "Conflict", code) {
        super(message, 409, true, code);
    }
}
export class ValidationError extends AppError {
    constructor(message = "Validation failed", code) {
        super(message, 422, true, code);
    }
}
export class InternalServerError extends AppError {
    constructor(message = "Internal Server Error", code) {
        super(message, 500, false, code);
    }
}
//# sourceMappingURL=errors.js.map