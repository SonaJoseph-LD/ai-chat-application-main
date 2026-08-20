import { Router } from 'express';
import { conversationController } from '../controllers/conversationController';
import { optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

// Conversations support authenticated user context if provided
router.get('/', optionalAuthMiddleware, (req, res) => conversationController.getAllConversations(req, res));
router.post('/', optionalAuthMiddleware, (req, res) => conversationController.createConversation(req, res));

export default router;
