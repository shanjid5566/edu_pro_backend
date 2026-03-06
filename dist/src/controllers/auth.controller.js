import { z } from "zod";
import { AuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/response.js";
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export class AuthController {
    static async login(req, res) {
        try {
            const parsed = loginSchema.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponse.validationError(res, parsed.error.errors, "Validation Error");
            }
            const { email, password } = parsed.data;
            const result = await AuthService.login(email, password);
            return ApiResponse.success(res, result, "Login successful", 200);
        }
        catch (error) {
            if (error instanceof Error) {
                return ApiResponse.error(res, error.message, error.statusCode || 500, error);
            }
            return ApiResponse.error(res, "An unexpected error occurred", 500, error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map