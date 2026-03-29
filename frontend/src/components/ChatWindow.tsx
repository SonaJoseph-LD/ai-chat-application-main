import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchMessages } from '../lib/api';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';

const ChatWindow = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data, isFetching } = useQuery(['messages', conversationId], () => fetchMessages(conversationId), {
    enabled: !!conversationId,
    onSuccess: (data) => {
      setMessages(data);
      setLoading(false);
    },
  });

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>
      <InputBox onSend={handleNewMessage} />
    </div>
  );
};

export default ChatWindow;