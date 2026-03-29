import React from 'react';
import { useQuery } from 'react-query';
import { fetchConversations } from '../lib/api';

const Sidebar: React.FC = () => {
  const { data: conversations, isLoading, error } = useQuery('conversations', fetchConversations);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading conversations</div>;

  return (
    <div className="sidebar">
      <h2 className="text-lg font-bold">Conversations</h2>
      <ul className="conversation-list">
        {conversations.map((conversation) => (
          <li key={conversation.id} className="conversation-item">
            {conversation.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;