import { z } from "zod";
import { AuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/response.js";
/**
 * Zod schema for validating the incoming login request payload.
 * Enforces that the email is a valid format and the password is at least 8 characters.
 */
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
/**
 * Controller class for handling Authentication driven API requests.
 */
export class AuthController {
    /**
     * Handles user login API requests.
     * Validates the request body, delegates business logic to AuthService, and formats the response.
     *
     * @param req - Express Request object containing the email and password in the body.
     * @param res - Express Response object.
     */
    static async login(req, res) {
        try {
            // 1. Validate the request payload strictly using the Zod schema
            const parsed = loginSchema.safeParse(req.body);
            // 2. If validation fails, return a formatted 422 Validation Error
            if (!parsed.success) {
                return ApiResponse.validationError(res, parsed.error.issues, "Validation Error");
            }
            // 3. Extract the validated data
            const { email, password } = parsed.data;
            // 4. Delegate to the AuthService to handle database verification and token generation
            const result = await AuthService.login(email, password);
            // 5. Return a successful 200 OK response with the user and token
            return ApiResponse.success(res, result, "Login successful", 200);
        }
        catch (error) {
            // 6. Handle known custom AppErrors (like UnauthorizedError) with their specific status codes
            if (error instanceof Error) {
                return ApiResponse.error(res, error.message, error.statusCode || 500, error);
            }
            // 7. Catch all other unexpected errors with a generic 500 Internal Server Error
            return ApiResponse.error(res, "An unexpected error occurred", 500, error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map