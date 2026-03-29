export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  conversationId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  messages: Message[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChatMessage {
  content: string;
  userId: string;
}