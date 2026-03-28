"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
        this.jwtExpiry = process.env.JWT_EXPIRY || "7d";
    }
    /**
     * Login user with email and password
     */
    async login(payload) {
        try {
            const { email, password } = payload;
            // Find user by email
            const user = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return {
                    success: false,
                    message: "Invalid email or password",
                };
            }
            // Compare passwords
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid email or password",
                };
            }
            // Check if user is active
            if (user.status !== "active") {
                return {
                    success: false,
                    message: "User account is not active",
                };
            }
            // Generate token
            const token = this.generateToken(user.id, user.email, user.role);
            return {
                success: true,
                message: "Login successful",
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                    token,
                },
            };
        }
        catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: "Error logging in",
            };
        }
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return { valid: true, decoded };
        }
        catch (error) {
            return { valid: false };
        }
    }
    /**
     * Generate JWT token
     */
    generateToken(userId, email, role) {
        const payload = {
            userId,
            email,
            role,
        };
        const secret = this.jwtSecret;
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: this.jwtExpiry
        });
    }
    /**
     * Get user by ID
     */
    async getUserById(userId) {
        return await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                phone: true,
                status: true,
                createdAt: true,
            },
        });
    }
}
exports.default = new AuthService();
