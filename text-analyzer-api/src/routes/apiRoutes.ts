import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { createText, getText, updateText, deleteText, getTextAnalysis } from '../controllers/textController';

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/texts:
 *   post:
 *     summary: Create a new text
 *     tags: [Texts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created text
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Text'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/texts', createText);

/**
 * @swagger
 * /api/texts/{id}:
 *   get:
 *     summary: Get a text by ID
 *     tags: [Texts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested text
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Text'
 *       404:
 *         description: Text not found
 *       401:
 *         description: Unauthorized
 */
router.get('/texts/:id', getText);

/**
 * @swagger
 * /api/texts/{id}:
 *   put:
 *     summary: Update a text
 *     tags: [Texts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated text
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Text'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Text not found
 *       401:
 *         description: Unauthorized
 */
router.put('/texts/:id', updateText);

/**
 * @swagger
 * /api/texts/{id}:
 *   delete:
 *     summary: Delete a text
 *     tags: [Texts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Text deleted successfully
 *       404:
 *         description: Text not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/texts/:id', deleteText);

/**
 * @swagger
 * /api/texts/{id}/analysis:
 *   get:
 *     summary: Get analysis for a text
 *     tags: [Texts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The text analysis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TextAnalysis'
 *       404:
 *         description: Text not found
 *       401:
 *         description: Unauthorized
 */
router.get('/texts/:id/analysis', getTextAnalysis);

/**
 * @swagger
 * components:
 *   schemas:
 *     Text:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: string
 *         content:
 *           type: string
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TextAnalysis:
 *       type: object
 *       properties:
 *         words:
 *           type: number
 *         characters:
 *           type: number
 *         sentences:
 *           type: number
 *         paragraphs:
 *           type: number
 *         longestWords:
 *           type: array
 *           items:
 *             type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;