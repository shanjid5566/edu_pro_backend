"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
class AuthController {
    /**
     * Login endpoint
     */
    async login(req, res) {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const result = await authService_1.default.login({ email, password });
        return res.status(result.success ? 200 : 401).json(result);
    }
    /**
     * Get current user profile
     */
    async getProfile(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const user = await authService_1.default.getUserById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            console.error("Get profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Error fetching profile",
            });
        }
    }
}
exports.default = new AuthController();
