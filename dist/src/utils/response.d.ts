import { Response } from "express";
export declare class ApiResponse {
    /**
     * Send a success response
     */
    static success(res: Response, data?: any, message?: string, statusCode?: number): Response;
    /**
     * Send an error response
     */
    static error(res: Response, message?: string, statusCode?: number, error?: any): Response;
    /**
     * Send a validation error response
     */
    static validationError(res: Response, errors: any[], message?: string): Response;
    /**
     * Send a paginated response
     */
    static paginated(res: Response, data: any[], page: number, limit: number, total: number, message?: string): Response;
    /**
     * Send a created response
     */
    static created(res: Response, data?: any, message?: string): Response;
    /**
     * Send a no content response
     */
    static noContent(res: Response): Response;
}
export default ApiResponse;
//# sourceMappingURL=response.d.ts.map