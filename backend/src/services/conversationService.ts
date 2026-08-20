import { getConversationRepository, getUserRepository } from '../config/database';
import { Conversation } from '../entities/Conversation';
import { ConversationResponse } from '../models/Conversation';
import { MessageResponse } from '../models/Message';

export class ConversationService {
  public async getAllConversations(): Promise<ConversationResponse[]> {
    const convRepo = getConversationRepository();

    const conversations = await convRepo.find({
      relations: {
        messages: {
          user: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });

    return conversations.map((conv) => {
      const messages: MessageResponse[] = (conv.messages || []).map((m) => ({
        id: m.id,
        content: m.content,
        sender: m.user ? m.user.username : null,
        timestamp: m.timestamp ? new Date(m.timestamp).getTime() : null,
      }));

      return {
        id: conv.id,
        title: conv.title,
        messages: messages.length > 0 ? messages : null,
      };
    });
  }

  public async getConversationById(id: number): Promise<Conversation | null> {
    const convRepo = getConversationRepository();
    return convRepo.findOne({
      where: { id },
      relations: {
        user: true,
        messages: {
          user: true,
        },
      },
    });
  }

  public async createConversation(title: string, userId?: number): Promise<Conversation> {
    const convRepo = getConversationRepository();
    const userRepo = getUserRepository();

    let user = null;
    if (userId) {
      user = await userRepo.findOneBy({ id: userId });
    }

    const conversation = convRepo.create({
      title,
      user: user || undefined,
    });

    return convRepo.save(conversation);
  }

  public async deleteConversation(id: number): Promise<void> {
    const convRepo = getConversationRepository();
    await convRepo.delete(id);
  }
}

export const conversationService = new ConversationService();
