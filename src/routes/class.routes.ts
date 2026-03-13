import { Router } from "express";
import { classController } from "../controllers/class.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/classes:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get all classes
 *     description: Retrieve list of classes with pagination and search
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by class name or section
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 */
router.get("/", verifyToken, (req, res) => classController.getClasses(req, res));

/**
 * @swagger
 * /api/v1/classes/search/{query}:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Search classes
 *     description: Search classes by name or section
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
router.get("/search/:query", verifyToken, (req, res) => classController.searchClasses(req, res));

/**
 * @swagger
 * /api/v1/classes/stats:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get class statistics
 *     description: Retrieve class statistics and summaries
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get("/stats", verifyToken, (req, res) => classController.getStatistics(req, res));

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get single class
 *     description: Retrieve class by ID with attached subjects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class retrieved successfully
 *       404:
 *         description: Class not found
 */
router.get("/:id", verifyToken, (req, res) => classController.getClassById(req, res));

/**
 * @swagger
 * /api/v1/classes/{id}/students/count:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get student count in class
 *     description: Get the number of students enrolled in a class
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Student count retrieved successfully
 */
router.get("/:id/students/count", verifyToken, (req, res) => classController.getStudentCount(req, res));

/**
 * @swagger
 * /api/v1/classes:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Create new class
 *     description: Create a new class (Admin only)
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
 *               - section
 *               - classTeacherId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Class 10"
 *               section:
 *                 type: string
 *                 example: "A"
 *               classTeacherId:
 *                 type: string
 *                 example: "teacher_123"
 *               capacity:
 *                 type: number
 *                 example: 40
 *     responses:
 *       201:
 *         description: Class created successfully
 */
router.post("/", verifyToken, requireRole("ADMIN", "admin"), (req, res) => classController.createClass(req, res));

/**
 * @swagger
 * /api/v1/classes/bulk:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Bulk create classes
 *     description: Create multiple classes at once (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classes
 *             properties:
 *               classes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - section
 *                     - classTeacherId
 *                   properties:
 *                     name:
 *                       type: string
 *                     section:
 *                       type: string
 *                     classTeacherId:
 *                       type: string
 *                     capacity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Bulk classes created successfully
 */
router.post("/bulk", verifyToken, requireRole("ADMIN", "admin"), (req, res) => classController.bulkCreateClasses(req, res));

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   put:
 *     tags:
 *       - Classes
 *     summary: Update class
 *     description: Update class details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               section:
 *                 type: string
 *               classTeacherId:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       404:
 *         description: Class not found
 */
router.put("/:id", verifyToken, requireRole("ADMIN", "admin"), (req, res) => classController.updateClass(req, res));

/**
 * @swagger
 * /api/v1/classes/{id}/subjects:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Assign subjects to class
 *     description: Assign multiple subjects to a class (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subjectIds
 *             properties:
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["subject_1", "subject_2", "subject_3"]
 *     responses:
 *       200:
 *         description: Subjects assigned successfully
 */
router.post("/:id/subjects", verifyToken, requireRole("ADMIN", "admin"), (req, res) => classController.assignSubjects(req, res));

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   delete:
 *     tags:
 *       - Classes
 *     summary: Delete class
 *     description: Delete a class (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */
router.delete("/:id", verifyToken, requireRole("ADMIN", "admin"), (req, res) => classController.deleteClass(req, res));

export default router;
