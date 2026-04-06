import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  
  // Robust check for user identity
  const messageUserId = (message as any).user?.id || message.userId;
  const isUserMessage = String(messageUserId) === String(currentUser?.id);

  return (
    <div className={`flex w-full mb-4 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
          isUserMessage 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div className={`text-[10px] mt-1 ${isUserMessage ? 'text-blue-100 text-right' : 'text-gray-400 text-left'}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
