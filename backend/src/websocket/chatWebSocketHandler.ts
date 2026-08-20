import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import url from 'url';
import { messageService } from '../services/messageService';
import { conversationService } from '../services/conversationService';
import { authService } from '../services/authService';
import { aiClient } from '../services/aiClient';

interface WsMessageRequest {
  content: string;
  conversationId: number;
  userId: number;
}

export class ChatWebSocketHandler {
  private conversationSessions = new Map<string, Set<WebSocket>>();

  public setup(wss: WebSocketServer): void {
    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      let conversationId = '';

      if (req.url) {
        const parsedUrl = url.parse(req.url, true);
        if (parsedUrl.query.conversationId) {
          conversationId = String(parsedUrl.query.conversationId);
          this.addSession(conversationId, ws);
          console.log(`[WebSocket] Client connected and joined conversation ${conversationId}`);
        }
      }

      ws.on('message', async (data: string | Buffer) => {
        try {
          const payloadStr = data.toString();
          console.log(`[WebSocket] Message received: ${payloadStr}`);
          const request: WsMessageRequest = JSON.parse(payloadStr);

          if (!conversationId) {
            conversationId = String(request.conversationId);
            this.addSession(conversationId, ws);
          }

          if (!request.userId || !request.conversationId || !request.content) {
            this.sendError(ws, 'Missing required fields: userId, conversationId, or content');
            return;
          }

          const user = await authService.getUserById(request.userId);
          if (!user) {
            this.sendError(ws, `User not found with ID: ${request.userId}`);
            return;
          }

          const conv = await conversationService.getConversationById(request.conversationId);
          if (!conv) {
            this.sendError(ws, `Conversation not found with ID: ${request.conversationId}`);
            return;
          }

          // 1. Save User Message to database
          const savedUserMessage = await messageService.saveMessage(
            request.conversationId,
            user.id,
            request.content
          );

          // Broadcast user message to all clients in this conversation
          this.broadcastMessage(conversationId, savedUserMessage);

          // 2. Call AI Service
          const aiResponseText = await aiClient.sendMessage(
            user.id.toString(),
            request.content
          );

          // 3. Save AI Message
          let aiUser = await authService.getUserByUsername('ai_assistant');
          if (!aiUser) {
            aiUser = user;
          }

          const savedAiMessage = await messageService.saveMessage(
            request.conversationId,
            aiUser.id,
            aiResponseText
          );

          // Broadcast AI response to all clients in this conversation
          this.broadcastMessage(conversationId, savedAiMessage);
        } catch (error: any) {
          console.error('[WebSocket] Error processing message:', error);
          this.sendError(ws, `Error processing message: ${error?.message || error}`);
        }
      });

      ws.on('close', () => {
        if (conversationId) {
          this.removeSession(conversationId, ws);
          console.log(`[WebSocket] Client disconnected from conversation ${conversationId}`);
        }
      });

      ws.on('error', (err) => {
        console.error('[WebSocket] Error on socket:', err);
      });
    });
  }

  private addSession(conversationId: string, ws: WebSocket): void {
    if (!this.conversationSessions.has(conversationId)) {
      this.conversationSessions.set(conversationId, new Set());
    }
    this.conversationSessions.get(conversationId)?.add(ws);
  }

  private removeSession(conversationId: string, ws: WebSocket): void {
    const sessions = this.conversationSessions.get(conversationId);
    if (sessions) {
      sessions.delete(ws);
      if (sessions.size === 0) {
        this.conversationSessions.delete(conversationId);
      }
    }
  }

  private broadcastMessage(conversationId: string, message: any): void {
    const sessions = this.conversationSessions.get(conversationId);
    if (!sessions) return;

    const payload = JSON.stringify(message);
    sessions.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          console.error('[WebSocket] Broadcast error:', err);
        }
      }
    });
  }

  private sendError(ws: WebSocket, errorMsg: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ error: errorMsg }));
      } catch (err) {
        console.error('[WebSocket] Error sending error message:', err);
      }
    }
  }
}

export const chatWebSocketHandler = new ChatWebSocketHandler();
