'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, createConversation } from '../lib/api';
import { useChatStore } from '../store';
import { getUser, logout } from '../lib/auth';
import { useRouter } from 'next/navigation';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { activeConversationId, setActiveConversationId } = useChatStore();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!currentUser,
  });

  const handleNewChat = async () => {
    if (isCreating) return;
    try {
      setIsCreating(true);
      const newConv = await createConversation('New Chat');
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (newConv && newConv.id) {
        setActiveConversationId(String(newConv.id));
      }
    } catch (err) {
      console.error('Failed to create new conversation', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    setActiveConversationId(null);
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <div className="w-64 flex-none bg-gray-800 text-white flex flex-col h-full border-r border-gray-700">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-400">AI Chat</h2>
      </div>

      <div className="p-3 border-b border-gray-700">
        <button
          onClick={handleNewChat}
          disabled={isCreating || !currentUser}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>+</span>
          <span>{isCreating ? 'Creating...' : 'New Chat'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2 px-1 tracking-wider">
          Conversations
        </h3>

        {isLoading && <div className="text-sm text-gray-400 italic px-2">Loading...</div>}
        {error && <div className="text-sm text-red-400 italic px-2">Error loading chats</div>}

        <ul className="space-y-1">
          {conversations?.map((conversation: any) => {
            const isSelected = String(conversation.id) === String(activeConversationId);
            return (
              <li
                key={conversation.id}
                onClick={() => setActiveConversationId(String(conversation.id))}
                className={`p-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                  isSelected
                    ? 'bg-blue-900/60 border border-blue-500/50 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700/70 hover:text-white'
                }`}
              >
                <div className="truncate">{conversation.title || `Chat #${conversation.id}`}</div>
              </li>
            );
          })}
          {!isLoading && !error && conversations?.length === 0 && (
            <li className="text-xs text-gray-500 italic px-2">No conversations yet</li>
          )}
        </ul>
      </div>

      {currentUser && (
        <div className="p-3 border-t border-gray-700 bg-gray-850 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white uppercase">
              {currentUser.username?.[0] || 'U'}
            </div>
            <span className="text-xs font-medium text-gray-200 truncate">
              {currentUser.username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded"
            title="Logout"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

