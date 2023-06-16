import express from 'express';
import { quizzController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { quizzValidation } from '../../validations/index.js';

const router = express.Router();

router
	.route('/')
	.post(auth('manageQuizzes'), validate(quizzValidation.createQuizz), quizzController.createQuizz)
	.get(auth(), validate(quizzValidation.getQuizzes), quizzController.getQuizzes);

router
	.route('/:quizzId')
	.get(auth(), validate(quizzValidation.getQuizz), quizzController.getQuizz)
	.patch(auth('manageQuizzes'), validate(quizzValidation.updateQuizz), quizzController.updateQuizz)
	.delete(auth('manageQuizzes'), validate(quizzValidation.deleteQuizz), quizzController.deleteQuizz);

export default router;

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quizz management and retrieval
 */

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a quizz
 *     description: Only admins can create other quizzes.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - videoId
 *               - options
 *             properties:
 *               question:
 *                 type: string
 *               description:
 *                 type: string
 *               videoId:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - option
 *                     - isCorrect
 *                   properties:
 *                     option:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *             example:
 *               question: What is the capital of Bangladesh?
 *               description: After 1971.
 *               videoId: 5fbd9d1f9d6b28001c2d5e97
 *               options: [
 *                 {
 *                   option: Dhaka,
 *                   isCorrect: true
 *                 },
 *                 {
 *                   option: Chittagong,
 *                   isCorrect: false
 *                 },
 *                 {
 *                   option: Khulna,
 *                   isCorrect: false
 *                 },
 *                 {
 *                   option: Rajshahi,
 *                   isCorrect: false
 *                 }
 *               ]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quizz'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all quizzes
 *     description: Only admins can retrieve all quizzes.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: question
 *         schema:
 *          type: string
 *         description: Quizz question
 *       - in: query
 *         name: videoId
 *         schema:
 *          type: string
 *         description: Video id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of quizzes
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
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Quizz'
 *                  page:
 *                    type: number
 *                    example: 1
 *                  limit:
 *                    type: number
 *                    example: 10
 *                  totalPages:
 *                    type: number
 *                    example: 1
 *                  totalResults:
 *                    type: number
 *                    example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get a quizz
 *     description: Logged in users can fetch only their own quizz information. Only admins can fetch other quizzes.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quizz id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quizz'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   patch:
 *     summary: Update a quizz
 *     description: Only admins can update quizzes.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quizz id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               description:
 *                 type: string
 *               videoId:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - option
 *                     - isCorrect
 *                   properties:
 *                     option:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *             example:
 *               question: Updated question
 *               description: Updated description
 *               videoId: 5fbd9d1f9d6b28001c2d5e97
 *               options: [
 *                 {
 *                   option: Dhaka,
 *                   isCorrect: true
 *                 },
 *                 {
 *                   option: Chittagong,
 *                   isCorrect: false
 *                 },
 *                 {
 *                   option: Khulna,
 *                   isCorrect: false
 *                 },
 *                 {
 *                   option: Rajshahi,
 *                   isCorrect: false
 *                 }
 *               ]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quizz'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a quizz
 *     description: Only admins can delete quizzes.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quizz id
 *     responses:
 *       "204":
 *         description: No Content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
