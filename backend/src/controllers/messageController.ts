import { Request, Response } from 'express';
import { messageService } from '../services/messageService';
import { conversationService } from '../services/conversationService';
import { authService } from '../services/authService';
import { aiClient } from '../services/aiClient';
import { CreateMessageRequest } from '../models/Message';

export class MessageController {
  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, conversationId, userId }: CreateMessageRequest = req.body;

      if (!content) {
        res.status(400).send('Message content is required');
        return;
      }
      if (!conversationId) {
        res.status(400).send('Conversation ID is required');
        return;
      }
      if (!userId) {
        res.status(400).send('User ID is required');
        return;
      }

      const user = await authService.getUserById(userId);
      if (!user) {
        res.status(400).send(`User not found with ID: ${userId}`);
        return;
      }

      const conv = await conversationService.getConversationById(conversationId);
      if (!conv) {
        res.status(400).send(`Conversation not found with ID: ${conversationId}`);
        return;
      }

      // 1. Save User Message
      await messageService.saveMessage(conversationId, user.id, content);

      try {
        // 2. Call AI Service
        const aiResponseText = await aiClient.sendMessage(user.id.toString(), content);

        // 3. Save AI Message
        let aiUser = await authService.getUserByUsername('ai_assistant');
        if (!aiUser) {
          aiUser = user;
        }

        const savedAiMessage = await messageService.saveMessage(
          conversationId,
          aiUser.id,
          aiResponseText
        );

        // Return AI's message
        res.status(200).json(savedAiMessage);
      } catch (e: any) {
        res.status(500).send(`Error processing AI response: ${e.message}`);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send message' });
    }
  }

  public async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = parseInt(req.params.conversationId, 10);
      if (isNaN(conversationId)) {
        res.status(400).json({ error: 'Invalid conversation ID' });
        return;
      }

      const messages = await messageService.getMessagesByConversationId(conversationId);
      res.status(200).json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to retrieve messages' });
    }
  }
}

export const messageController = new MessageController();
