'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ChatWindow from '../../components/ChatWindow';
import InputBox from '../../components/InputBox';
import { fetchMessages } from '../../lib/api';
import { Message, User } from '../../types';
import { getUser } from '../../lib/auth';

const ChatPage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const loggedInUser = getUser();
    setUser(loggedInUser);
    // In a real app, this would come from the URL or a selection in the Sidebar
    setConversationId('1'); 
  }, []);

  const { data: chatMessages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!conversationId || !user) return;

    // Establish WebSocket connection
    const wsUrl = `ws://localhost:8080/ws-chat?conversationId=${conversationId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected to conversation', conversationId);
    };

    ws.onmessage = (event) => {
      try {
        const received = JSON.parse(event.data);
        
        if (received.error) {
          console.error(received.error);
          return;
        }

        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => String(m.id) === String(received.id))) {
            return prev;
          }

          // Filter out matching optimistic temp message
          const filtered = prev.filter(
            (m) => !m.id.toString().startsWith('temp-') || m.content !== received.content
          );

          return [...filtered, {
            id: String(received.id),
            content: received.content,
            userId: String(received.user?.id || received.userId),
            conversationId: String(received.conversation?.id || received.conversationId),
            timestamp: received.timestamp || new Date().toISOString()
          }];
        });

        // Hide typing indicator if the message comes from the AI
        const receivedUserId = String(received.user?.id || received.userId);
        if (receivedUserId !== String(user.id)) {
          setIsTyping(false);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error', err);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [conversationId, user]);

  const handleSendMessage = async (text: string) => {
    if (conversationId && user && socket && socket.readyState === WebSocket.OPEN) {
      setIsTyping(true);

      // Optimistically add user message to the UI immediately
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: text,
        userId: user.id,
        conversationId: conversationId,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, optimisticMessage]);
      
      // Send message via WebSocket
      const payload = {
        content: text,
        conversationId: Number(conversationId),
        userId: Number(user.id)
      };
      socket.send(JSON.stringify(payload));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-4xl mx-auto shadow-sm border-x border-gray-200">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-gray-800">Current Conversation</h2>
        <div className="flex items-center text-xs text-green-500 mt-1">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
          AI Assistant Online
        </div>
      </div>
      
      <ChatWindow messages={messages} isTyping={isTyping} />
      
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <InputBox onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
