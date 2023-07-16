import express from 'express';
import { quizzMarkController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { quizzMarkValidation } from '../../validations/index.js';

const router = express.Router();

router
	.route('/')
	.post(auth(), validate(quizzMarkValidation.createQuizzMark), quizzMarkController.createQuizzMark)
	.get(auth(), validate(quizzMarkValidation.getQuizzMarks), quizzMarkController.getQuizzMarks);

export default router;

/**
 * @swagger
 * tags:
 *   name: Quizz Marks
 *   description: Quizz marks management and retrieval
 */

/**
 * @swagger
 * /quizzes-marks:
 *   post:
 *     summary: Create a quizz mark
 *     description: Logged in users can create a quizz mark.
 *     tags: [Quizz Marks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *               - student
 *               - selectedAnswers
 *             properties:
 *               video:
 *                 type: string
 *               student:
 *                 type: string
 *               selectedAnswers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - quizzId
 *                     - selectedOptions
 *                   properties:
 *                     quizzId:
 *                       type: string
 *                     selectedOptions:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               video: 5f723f4e8f6e744a6fe1b1d0
 *               student: 5f723f4e8f6e744a6fe1b1d0
 *               selectedAnswers:
 *                 - quizzId: 5f723f4e8f6e744a6fe1b1d0
 *                   selectedOptions: ["5f723f4e8f6e744a6fe1b1d0", "5f723f4e8f6e744a6fe1b1d0"]
 *                 - quizzId: 5f723f4e8f6e744a6fe1b1d0
 *                   selectedOptions: ["5f723f4e8f6e744a6fe1b1d0", "5f723f4e8f6e744a6fe1b1d0"]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizzMark'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get quizz marks
 *     description: Only admins can retrieve all quizz marks.
 *     tags: [Quizz Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: video
 *         schema:
 *           type: string
 *         description: Video id
 *       - in: query
 *         name: student
 *         schema:
 *           type: string
 *         description: Student id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of quizz marks
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizzMark'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
