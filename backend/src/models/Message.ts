import { UserDto } from './User';

export interface Message {
  id: number;
  conversationId: number;
  userId: number;
  content: string;
  timestamp: string | Date;
  user?: UserDto;
  conversation?: { id: number };
}

export interface MessageResponse {
  id: number;
  content: string;
  sender: string | null;
  timestamp: number | null;
}

export interface CreateMessageRequest {
  content: string;
  conversationId: number;
  userId: number;
}
