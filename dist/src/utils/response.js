export class ApiResponse {
    /**
     * Send a success response
     */
    static success(res, data = null, message = "Success", statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send an error response
     */
    static error(res, message = "Error", statusCode = 500, error = null) {
        const response = {
            success: false,
            message,
            error,
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send a validation error response
     */
    static validationError(res, errors, message = "Validation failed") {
        const response = {
            success: false,
            message,
            errors,
        };
        return res.status(422).json(response);
    }
    /**
     * Send a paginated response
     */
    static paginated(res, data, page, limit, total, message = "Success") {
        const response = {
            success: true,
            message,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
        return res.status(200).json(response);
    }
    /**
     * Send a created response
     */
    static created(res, data = null, message = "Resource created successfully") {
        return this.success(res, data, message, 201);
    }
    /**
     * Send a no content response
     */
    static noContent(res) {
        return res.status(204).send();
    }
}
export default ApiResponse;
//# sourceMappingURL=response.js.map