import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { UserRole } from "../../prisma/generated/prisma/enums";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
    token: string;
  };
}

class AuthService {
  private jwtSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
  private jwtExpiry = process.env.JWT_EXPIRY || "7d";

  /**
   * Login user with email and password
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const { email, password } = payload;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);

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
    } catch (error) {
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
  verifyToken(token: string): { valid: boolean; decoded?: any } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string, email: string, role: UserRole): string {
    const payload = {
      userId,
      email,
      role,
    };
    
    const secret: string = this.jwtSecret;
    
    return jwt.sign(payload, secret, { 
      expiresIn: this.jwtExpiry 
    } as SignOptions);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    return await prisma.user.findUnique({
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

export default new AuthService();
