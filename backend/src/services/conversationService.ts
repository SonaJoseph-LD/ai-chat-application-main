import { getConversationRepository, getUserRepository } from '../config/database';
import { Conversation } from '../entities/Conversation';
import { ConversationResponse } from '../models/Conversation';
import { MessageResponse } from '../models/Message';

export class ConversationService {
  public async getAllConversations(userId?: number): Promise<ConversationResponse[]> {
    const convRepo = getConversationRepository();
    const userRepo = getUserRepository();

    const whereClause = userId ? { user: { id: userId } } : {};

    let conversations = await convRepo.find({
      where: whereClause,
      relations: {
        user: true,
        messages: {
          user: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });

    // If a logged-in user has no conversations yet, create an initial default one
    if (userId && conversations.length === 0) {
      const user = await userRepo.findOneBy({ id: userId });
      if (user) {
        const defaultConv = convRepo.create({
          title: 'New Conversation',
          user,
        });
        const saved = await convRepo.save(defaultConv);
        conversations = [saved];
      }
    }

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
