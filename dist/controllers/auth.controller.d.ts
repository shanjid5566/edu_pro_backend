import { Request, Response } from "express";
/**
 * Controller class for handling Authentication driven API requests.
 */
export declare class AuthController {
    /**
     * Handles user login API requests.
     * Validates the request body, delegates business logic to AuthService, and formats the response.
     *
     * @param req - Express Request object containing the email and password in the body.
     * @param res - Express Response object.
     */
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map