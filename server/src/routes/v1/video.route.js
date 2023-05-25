import express from 'express';
import { videoController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { videoValidation } from '../../validations/index.js';

const router = express.Router();

router
	.route('/')
	.post(auth('manageVideos'), validate(videoValidation.createVideo), videoController.createVideo)
	.get(auth(), validate(videoValidation.getVideos), videoController.getVideos);

router
	.route('/:videoId')
	.get(auth(), validate(videoValidation.getVideo), videoController.getVideo)
	.patch(auth('manageVideos'), validate(videoValidation.updateVideo), videoController.updateVideo)
	.delete(auth('manageVideos'), validate(videoValidation.deleteVideo), videoController.deleteVideo);

export default router;

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video management and retrieval
 */

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Create a video
 *     description: Only admins can create other videos.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - url
 *               - thumbnail
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *                 format: url
 *               thumbnail:
 *                 type: string
 *                 format: url
 *               duration:
 *                 type: number
 *                 format: number
 *                 description: in seconds
 *             example:
 *               title: fake title
 *               description: fake description
 *               url: https://www.youtube.com/watch?v=5qap5aO4i9A
 *               thumbnail: https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg
 *               duration: 300
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Video'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Videos
 *     description: Only loggedin users can retrieve all videos.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Video title
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Video description
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
 *         description: Maximum number of videos
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
 *                     $ref: '#/components/schemas/Video'
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

/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     summary: Get a video
 *     description: Logged in users can fetch video information.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Video'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a video
 *     description: Only admins can update videos.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *                 format: url
 *               thumbnail:
 *                 type: string
 *                 format: url
 *               duration:
 *                 type: number
 *                 format: number
 *                 description: in seconds
 *             example:
 *               title: fake title
 *               description: fake description
 *               url: https://www.youtube.com/watch?v=5qap5aO4i9A
 *               thumbnail: https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg
 *               duration: 300
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Video'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a video
 *     description: Only admins can delete videos.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
