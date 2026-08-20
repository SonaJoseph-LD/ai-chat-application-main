import { MessageResponse } from './Message';

export interface Conversation {
  id: number;
  userId?: number;
  title: string;
  messages?: MessageResponse[] | null;
}

export interface ConversationResponse {
  id: number;
  title: string;
  messages: MessageResponse[] | null;
}

export interface CreateConversationRequest {
  title: string;
}
