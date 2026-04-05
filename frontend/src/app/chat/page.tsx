'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import ChatWindow from '../../components/ChatWindow';
import InputBox from '../../components/InputBox';
import { fetchMessages, sendMessage } from '../../lib/api';
import { Message } from '../../types';

const ChatPage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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
    onSuccess: (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      refetch();
    },
  });

  const handleSendMessage = async (text: string) => {
    if (conversationId) {
      await mutation.mutateAsync({ conversationId, text });
    }
  };

  useEffect(() => {
    // In a real app, this would come from the URL or a selection in the Sidebar
    setConversationId('1'); 
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-4xl mx-auto shadow-sm border-x border-gray-200">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-gray-800">Current Conversation</h2>
        <div className="flex items-center text-xs text-green-500 mt-1">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
          AI Assistant Online
        </div>
      </div>
      
      <ChatWindow messages={messages} />
      
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <InputBox onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
