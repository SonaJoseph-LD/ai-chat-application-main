import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // We'll need a way to determine if it's from the current user
  // For now, let's assume message.userId is compared to local storage user.id
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const isUserMessage = message.userId === currentUser?.id;

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${
          isUserMessage 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
        }`}
      >
        <p className="leading-relaxed">{message.content}</p>
        <div className={`text-[10px] mt-1 ${isUserMessage ? 'text-blue-100 text-right' : 'text-gray-400 text-left'}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
