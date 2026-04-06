import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-2"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 italic">
          No messages in this conversation. Start chatting!
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  );
};

export default ChatWindow;
