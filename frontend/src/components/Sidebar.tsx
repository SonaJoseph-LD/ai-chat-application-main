'use client';

import React from 'react';
import { useQuery } from 'react-query';
import { fetchConversations } from '../lib/api';

const Sidebar: React.FC = () => {
  const { data: conversations, isLoading, error } = useQuery('conversations', fetchConversations);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading conversations</div>;

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-blue-400">AI Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4 tracking-wider">Conversations</h3>
        <ul className="space-y-2">
          {conversations?.map((conversation: any) => (
            <li 
              key={conversation.id} 
              className="p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="font-medium truncate">{conversation.title}</div>
              {conversation.lastMessage && (
                <div className="text-xs text-gray-400 truncate mt-1">{conversation.lastMessage}</div>
              )}
            </li>
          ))}
          {conversations?.length === 0 && (
            <li className="text-sm text-gray-500 italic">No conversations found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
