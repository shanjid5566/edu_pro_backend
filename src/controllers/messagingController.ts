import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import messagingService from "../services/messagingService.js";

class MessagingController {
  async searchUsers(req: Request, res: Response) {
    try {
      const currentUserId = (req as any).userId as string | undefined;
      const currentUserRole = (req as any).userRole as UserRole | undefined;
      const query = (req.query.query || "").toString();
      const limit = parseInt((req.query.limit || "10").toString(), 10);

      if (!currentUserId || !currentUserRole) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const users = await messagingService.searchUsersForMessaging(
        currentUserId,
        currentUserRole,
        query,
        Number.isNaN(limit) ? 10 : limit
      );

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Error in searchUsers:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  async getConversation(req: Request, res: Response) {
    try {
      const currentUserId = (req as any).userId as string | undefined;
      const currentUserRole = (req as any).userRole as UserRole | undefined;
      const otherUserId = req.params.userId;
      const limit = parseInt((req.query.limit || "50").toString(), 10);

      if (!currentUserId || !currentUserRole) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!otherUserId) {
        return res.status(400).json({
          success: false,
          message: "userId is required",
        });
      }

      const messages = await messagingService.getConversationMessages(
        currentUserId,
        currentUserRole,
        otherUserId,
        Number.isNaN(limit) ? 50 : limit
      );

      return res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Error in getConversation:", error);

      if (
        error instanceof Error &&
        (error.message.includes("not allowed") ||
          error.message.includes("not found") ||
          error.message.includes("inactive"))
      ) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new MessagingController();
