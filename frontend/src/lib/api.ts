import { Message, ChatMessage } from '../types';
import { getToken, getUser } from './auth';

const API_BASE_URL = 'http://localhost:8080';

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages/${conversationId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
};

export const sendMessage = async (data: { conversationId: string; text: string }): Promise<Message> => {
  const user = getUser();
  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      conversationId: data.conversationId,
      content: data.text,
      userId: user.id
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to send message');
  }

  return response.json();
};

export const fetchConversations = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  return response.json();
};

export const createConversation = async (title: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  return response.json();
};
