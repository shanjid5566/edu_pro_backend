import { Request, Response } from "express";
import authService from "../services/authService";

class AuthController {
  /**
   * Login endpoint
   */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.login({ email, password });

    return res.status(result.success ? 200 : 401).json(result);
  }

  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await authService.getUserById(userId);

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
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching profile",
      });
    }
  }
}

export default new AuthController();
