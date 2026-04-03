import express from "express";
import { adminNoticeController } from "../controllers/adminNoticeController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes - All users can view notices
router.get("/", adminNoticeController.getAllNotices.bind(adminNoticeController));
router.get(
  "/search",
  adminNoticeController.searchNotices.bind(adminNoticeController)
);
router.get(
  "/statistics",
  adminNoticeController.getNoticeStatistics.bind(adminNoticeController)
);
router.get(
  "/pinned",
  adminNoticeController.getPinnedNotices.bind(adminNoticeController)
);
router.get(
  "/recent",
  adminNoticeController.getRecentNotices.bind(adminNoticeController)
);
router.get(
  "/category/:category",
  adminNoticeController.getNoticesByCategory.bind(adminNoticeController)
);
router.get(
  "/:id",
  adminNoticeController.getNoticeById.bind(adminNoticeController)
);

// Admin protected routes - Only admin can create, update, delete
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  adminNoticeController.createNotice.bind(adminNoticeController)
);
router.put(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  adminNoticeController.updateNotice.bind(adminNoticeController)
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  adminNoticeController.deleteNotice.bind(adminNoticeController)
);
router.patch(
  "/:id/pin",
  verifyToken,
  checkRole("ADMIN"),
  adminNoticeController.togglePinNotice.bind(adminNoticeController)
);

export default router;
