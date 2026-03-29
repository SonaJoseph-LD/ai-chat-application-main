import React from 'react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUserMessage = message.sender === 'user';

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs p-2 rounded-lg text-white ${
          isUserMessage ? 'bg-blue-500' : 'bg-gray-500'
        }`}
      >
        <p>{message.content}</p>
        <span className="text-xs text-gray-300">{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default MessageBubble;