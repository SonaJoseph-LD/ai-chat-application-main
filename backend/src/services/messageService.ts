import {
  getMessageRepository,
  getConversationRepository,
  getUserRepository,
} from '../config/database';
import { Message as MessageEntity } from '../entities/Message';
import { Message } from '../models/Message';

export class MessageService {
  public async saveMessage(
    conversationId: number,
    userId: number,
    content: string,
    timestamp?: Date
  ): Promise<Message> {
    const msgRepo = getMessageRepository();
    const convRepo = getConversationRepository();
    const userRepo = getUserRepository();

    const conversation = await convRepo.findOneBy({ id: conversationId });
    if (!conversation) {
      throw new Error(`Conversation not found with ID: ${conversationId}`);
    }

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }

    const msg = msgRepo.create({
      content,
      conversation,
      user,
      timestamp: timestamp || new Date(),
    });

    const saved = await msgRepo.save(msg);

    return {
      id: saved.id,
      conversationId: conversation.id,
      userId: user.id,
      content: saved.content,
      timestamp: saved.timestamp,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      conversation: {
        id: conversation.id,
      },
    };
  }

  public async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    const msgRepo = getMessageRepository();

    const messages = await msgRepo.find({
      where: {
        conversation: { id: conversationId },
      },
      relations: {
        user: true,
        conversation: true,
      },
      order: {
        id: 'ASC',
      },
    });

    return messages.map((m) => ({
      id: m.id,
      conversationId: m.conversation ? m.conversation.id : conversationId,
      userId: m.user ? m.user.id : 0,
      content: m.content,
      timestamp: m.timestamp,
      user: m.user
        ? {
            id: m.user.id,
            username: m.user.username,
            email: m.user.email,
          }
        : undefined,
      conversation: {
        id: m.conversation ? m.conversation.id : conversationId,
      },
    }));
  }
}

export const messageService = new MessageService();
