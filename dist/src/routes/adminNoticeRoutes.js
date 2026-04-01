"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminNoticeController_js_1 = require("../controllers/adminNoticeController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = express_1.default.Router();
// Public routes - All users can view notices
router.get("/", adminNoticeController_js_1.adminNoticeController.getAllNotices.bind(adminNoticeController_js_1.adminNoticeController));
router.get("/search", adminNoticeController_js_1.adminNoticeController.searchNotices.bind(adminNoticeController_js_1.adminNoticeController));
router.get("/statistics", adminNoticeController_js_1.adminNoticeController.getNoticeStatistics.bind(adminNoticeController_js_1.adminNoticeController));
router.get("/pinned", adminNoticeController_js_1.adminNoticeController.getPinnedNotices.bind(adminNoticeController_js_1.adminNoticeController));
router.get("/recent", adminNoticeController_js_1.adminNoticeController.getRecentNotices.bind(adminNoticeController_js_1.adminNoticeController));
router.get("/category/:category", adminNoticeController_js_1.adminNoticeController.getNoticesByCategory.bind(adminNoticeController_js_1.adminNoticeController));
router.get("/:id", adminNoticeController_js_1.adminNoticeController.getNoticeById.bind(adminNoticeController_js_1.adminNoticeController));
// Admin protected routes - Only admin can create, update, delete
router.post("/", authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("admin"), adminNoticeController_js_1.adminNoticeController.createNotice.bind(adminNoticeController_js_1.adminNoticeController));
router.put("/:id", authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("admin"), adminNoticeController_js_1.adminNoticeController.updateNotice.bind(adminNoticeController_js_1.adminNoticeController));
router.delete("/:id", authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("admin"), adminNoticeController_js_1.adminNoticeController.deleteNotice.bind(adminNoticeController_js_1.adminNoticeController));
router.patch("/:id/pin", authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("admin"), adminNoticeController_js_1.adminNoticeController.togglePinNotice.bind(adminNoticeController_js_1.adminNoticeController));
exports.default = router;
