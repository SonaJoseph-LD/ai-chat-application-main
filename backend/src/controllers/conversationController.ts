import { Request, Response } from 'express';
import { conversationService } from '../services/conversationService';
import { AuthenticatedRequest } from '../middleware/auth';
import { CreateConversationRequest } from '../models/Conversation';

export class ConversationController {
  public async getAllConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const conversations = await conversationService.getAllConversations(userId);
      res.status(200).json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to retrieve conversations' });
    }
  }

  public async createConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title }: CreateConversationRequest = req.body;
      const userId = req.user?.id;

      if (!title) {
        res.status(400).json({ error: 'Conversation title is required' });
        return;
      }

      const conversation = await conversationService.createConversation(title, userId);
      res.status(201).json({
        id: conversation.id,
        title: conversation.title,
        messages: null,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create conversation' });
    }
  }
}

export const conversationController = new ConversationController();
