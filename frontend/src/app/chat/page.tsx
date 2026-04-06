'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import ChatWindow from '../../components/ChatWindow';
import InputBox from '../../components/InputBox';
import { fetchMessages, sendMessage } from '../../lib/api';
import { Message, User } from '../../types';
import { getUser } from '../../lib/auth';

const ChatPage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedInUser = getUser();
    setUser(loggedInUser);
    // In a real app, this would come from the URL or a selection in the Sidebar
    setConversationId('1'); 
  }, []);

  const { data: chatMessages, refetch } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  const mutation = useMutation({
    mutationFn: sendMessage,
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (newMessage) => {
      // The newMessage returned from the server will replace our optimistic one 
      // when we refetch or we can manually append it.
      // Since we refetch, we'll let the query handle the final state.
      refetch().then(() => {
        setIsTyping(false);
      });
    },
    onError: () => {
      setIsTyping(false);
    }
  });

  const handleSendMessage = async (text: string) => {
    if (conversationId && user) {
      // Optimistically add user message to the UI immediately
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: text,
        userId: user.id,
        conversationId: conversationId,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, optimisticMessage]);
      
      // Trigger the mutation
      mutation.mutate({ conversationId, text });
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
