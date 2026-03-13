import { Router } from "express";
import { examController } from "../controllers/exam.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/exams:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get all exams with filters
 *     description: Retrieve list of exams with pagination and filters
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [UPCOMING, ONGOING, COMPLETED]
 *         description: Filter by exam status
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Filter by class ID
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: Filter by subject ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY]
 *         description: Filter by exam type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by exam name
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
 */
router.get("/", verifyToken, (req, res) => examController.getExams(req, res));

/**
 * @swagger
 * /api/v1/exams/search/{query}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Search exams
 *     description: Search exams by name
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */
router.get("/search/:query", verifyToken, (req, res) => examController.searchExams(req, res));

/**
 * @swagger
 * /api/v1/exams/stats:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get exam statistics
 *     description: Retrieve exam statistics and summaries
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get("/stats", verifyToken, (req, res) => examController.getStatistics(req, res));

/**
 * @swagger
 * /api/v1/exams/export:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Export exams as CSV
 *     description: Export exams using the same filters as list API
 *     security:
 *       - BearerAuth: []
 */
router.get("/export", verifyToken, (req, res) => examController.exportExams(req, res));

router.get("/teacher", verifyToken, requireRole("TEACHER", "teacher"), (req, res) =>
	examController.getTeacherExams(req, res)
);

router.post("/teacher", verifyToken, requireRole("TEACHER", "teacher"), (req, res) =>
	examController.createTeacherExam(req, res)
);

router.post("/teacher/:examId/question-paper", verifyToken, requireRole("TEACHER", "teacher"), (req, res) =>
	examController.uploadTeacherQuestionPaper(req, res)
);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get single exam
 *     description: Retrieve exam by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam retrieved successfully
 *       404:
 *         description: Exam not found
 */
router.get("/:id", verifyToken, (req, res) => examController.getExamById(req, res));

/**
 * @swagger
 * /api/v1/exams/{id}/results:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get exam with results
 *     description: Retrieve exam details with results and statistics
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam with results retrieved successfully
 */
router.get("/:id/results", verifyToken, (req, res) => examController.getExamWithResults(req, res));

/**
 * @swagger
 * /api/v1/exams:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create new exam
 *     description: Create a new exam (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - classId
 *               - subjectId
 *               - date
 *               - duration
 *               - totalMarks
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mathematics Midterm"
 *               classId:
 *                 type: string
 *                 example: "class_123"
 *               subjectId:
 *                 type: string
 *                 example: "subject_456"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-15T10:00:00Z"
 *               duration:
 *                 type: string
 *                 example: "2 hours"
 *               totalMarks:
 *                 type: number
 *                 example: 100
 *               type:
 *                 type: string
 *                 enum: [MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY]
 *                 example: "MONTHLY"
 *               status:
 *                 type: string
 *                 enum: [UPCOMING, ONGOING, COMPLETED]
 *                 example: "UPCOMING"
 *     responses:
 *       201:
 *         description: Exam created successfully
 */
router.post("/", verifyToken, requireRole("ADMIN", "admin"), (req, res) => examController.createExam(req, res));

/**
 * @swagger
 * /api/v1/exams/bulk:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Bulk create exams
 *     description: Create multiple exams at once (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exams
 *             properties:
 *               exams:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - classId
 *                     - subjectId
 *                     - date
 *                     - duration
 *                     - totalMarks
 *                     - type
 *                   properties:
 *                     name:
 *                       type: string
 *                     classId:
 *                       type: string
 *                     subjectId:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     duration:
 *                       type: string
 *                     totalMarks:
 *                       type: number
 *                     type:
 *                       type: string
 *                       enum: [MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY]
 *                     status:
 *                       type: string
 *                       enum: [UPCOMING, ONGOING, COMPLETED]
 *     responses:
 *       201:
 *         description: Bulk exams created successfully
 */
router.post("/bulk", verifyToken, requireRole("ADMIN", "admin"), (req, res) => examController.bulkCreateExams(req, res));

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   put:
 *     tags:
 *       - Exams
 *     summary: Update exam
 *     description: Update exam details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: string
 *               totalMarks:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY]
 *               status:
 *                 type: string
 *                 enum: [UPCOMING, ONGOING, COMPLETED]
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *       404:
 *         description: Exam not found
 */
router.put("/:id", verifyToken, requireRole("ADMIN", "admin"), (req, res) => examController.updateExam(req, res));

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   delete:
 *     tags:
 *       - Exams
 *     summary: Delete exam
 *     description: Delete an exam (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 *       404:
 *         description: Exam not found
 */
router.delete("/:id", verifyToken, requireRole("ADMIN", "admin"), (req, res) => examController.deleteExam(req, res));

export default router;
