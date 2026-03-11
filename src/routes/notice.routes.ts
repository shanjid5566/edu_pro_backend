import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { noticeController } from "../controllers/notice.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Validation middleware to handle errors
 */
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// ========================
// Public Routes (No Auth Required)
// ========================

/**
 * @swagger
 * /api/v1/notices:
 *   get:
 *     tags: [Notices]
 *     summary: Get all notices with pagination
 *     description: Retrieve all notices with optional filtering and pagination
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of notices per page
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ALL, GENERAL, EXAM, EVENT, HOLIDAY]
 *         description: Filter by notice category
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [recent, oldest, pinned]
 *           default: recent
 *         description: Sort notices by specified order
 *     responses:
 *       200:
 *         description: Notices retrieved successfully
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("PageSize must be between 1 and 100"),
    query("category").optional().isString(),
    query("sortBy").optional().isIn(["recent", "oldest", "pinned"]),
  ],
  handleValidationErrors,
  noticeController.getAllNotices.bind(noticeController)
);

/**
 * @swagger
 * /api/v1/notices/pinned:
 *   get:
 *     tags: [Notices]
 *     summary: Get pinned notices
 *     description: Retrieve all pinned notices
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of pinned notices to return
 *     responses:
 *       200:
 *         description: Pinned notices retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
  "/pinned",
  [
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
  ],
  handleValidationErrors,
  noticeController.getPinnedNotices.bind(noticeController)
);

/**
 * @swagger
 * /api/v1/notices/category/{category}:
 *   get:
 *     tags: [Notices]
 *     summary: Get notices by category
 *     description: Retrieve notices filtered by a specific category
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [GENERAL, EXAM, EVENT, HOLIDAY]
 *         description: Notice category
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Notices retrieved successfully
 *       400:
 *         description: Invalid category
 *       500:
 *         description: Server error
 */
router.get(
  "/category/:category",
  [
    param("category").notEmpty().withMessage("Category is required"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("PageSize must be between 1 and 100"),
  ],
  handleValidationErrors,
  noticeController.getNoticesByCategory.bind(noticeController)
);

/**
 * @swagger
 * /api/v1/notices/search:
 *   get:
 *     tags: [Notices]
 *     summary: Search notices
 *     description: Search notices by title or message content
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Invalid search query
 *       500:
 *         description: Server error
 */
router.get(
  "/search",
  [
    query("q").notEmpty().withMessage("Search query is required"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("PageSize must be between 1 and 100"),
  ],
  handleValidationErrors,
  noticeController.searchNotices.bind(noticeController)
);

/**
 * @swagger
 * /api/v1/notices/{id}:
 *   get:
 *     tags: [Notices]
 *     summary: Get single notice
 *     description: Retrieve details of a specific notice by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notice ID
 *     responses:
 *       200:
 *         description: Notice retrieved successfully
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  [
    param("id").notEmpty().withMessage("Notice ID is required"),
  ],
  handleValidationErrors,
  noticeController.getNoticeById.bind(noticeController)
);

// ========================
// Protected Routes (Auth Required - Admin Only)
// ========================

/**
 * @swagger
 * /api/v1/notices:
 *   post:
 *     tags: [Notices]
 *     summary: Create new notice
 *     description: Create a new notice (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Notice title
 *               message:
 *                 type: string
 *                 description: Notice message content
 *               category:
 *                 type: string
 *                 enum: [GENERAL, EXAM, EVENT, HOLIDAY]
 *                 description: Notice category
 *               priority:
 *                 type: string
 *                 enum: [NORMAL, HIGH, URGENT]
 *                 default: NORMAL
 *               pinned:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Notice created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  [
    body("title").notEmpty().trim().withMessage("Title is required"),
    body("message").notEmpty().trim().withMessage("Message is required"),
    body("category").notEmpty().isIn(["GENERAL", "EXAM", "EVENT", "HOLIDAY"]).withMessage("Invalid category"),
    body("priority").optional().isIn(["NORMAL", "HIGH", "URGENT"]).withMessage("Invalid priority"),
    body("pinned").optional().isBoolean().withMessage("Pinned must be a boolean"),
  ],
  handleValidationErrors,
  noticeController.createNotice.bind(noticeController)
);

/**
 * @swagger
 * /api/v1/notices/{id}:
 *   put:
 *     tags: [Notices]
 *     summary: Update notice
 *     description: Update an existing notice (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [GENERAL, EXAM, EVENT, HOLIDAY]
 *               priority:
 *                 type: string
 *                 enum: [NORMAL, HIGH, URGENT]
 *               pinned:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notice updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  verifyToken,
  requireRole("admin"),
  [
    param("id").notEmpty().withMessage("Notice ID is required"),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("message").optional().trim().notEmpty().withMessage("Message cannot be empty"),
    body("category").optional().isIn(["GENERAL", "EXAM", "EVENT", "HOLIDAY"]).withMessage("Invalid category"),
    body("priority").optional().isIn(["NORMAL", "HIGH", "URGENT"]).withMessage("Invalid priority"),
    body("pinned").optional().isBoolean().withMessage("Pinned must be a boolean"),
  ],
  handleValidationErrors,
  noticeController.updateNotice.bind(noticeController)
);

/**
 * @swagger
 * /api/v1/notices/{id}/pin:
 *   put:
 *     tags: [Notices]
 *     summary: Pin or unpin notice
 *     description: Toggle pin status of a notice (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pinned
 *             properties:
 *               pinned:
 *                 type: boolean
 *                 description: Pin or unpin the notice
 *     responses:
 *       200:
 *         description: Notice pin status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/pin",
  verifyToken,
  requireRole("admin"),
  [
    param("id").notEmpty().withMessage("Notice ID is required"),
    body("pinned").isBoolean().withMessage("Pinned must be a boolean value"),
  ],
  handleValidationErrors,
  noticeController.togglePinNotice.bind(noticeController)
);

/**
 * @swagger
 * /api/v1/notices/{id}:
 *   delete:
 *     tags: [Notices]
 *     summary: Delete notice
 *     description: Delete a notice (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notice ID
 *     responses:
 *       200:
 *         description: Notice deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  [
    param("id").notEmpty().withMessage("Notice ID is required"),
  ],
  handleValidationErrors,
  noticeController.deleteNotice.bind(noticeController)
);

export default router;
