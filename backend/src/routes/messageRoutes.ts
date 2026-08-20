import { Router } from 'express';
import { messageController } from '../controllers/messageController';
import { optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuthMiddleware, (req, res) => messageController.sendMessage(req, res));
router.get('/:conversationId', optionalAuthMiddleware, (req, res) => messageController.getMessages(req, res));

export default router;
