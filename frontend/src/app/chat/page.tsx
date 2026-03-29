import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import ChatWindow from '../../components/ChatWindow';
import InputBox from '../../components/InputBox';
import { fetchMessages, sendMessage } from '../../lib/api';

const ChatPage = () => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  const { data: chatMessages, refetch } = useQuery(
    ['messages', conversationId],
    () => fetchMessages(conversationId),
    {
      enabled: !!conversationId,
      onSuccess: (data) => setMessages(data),
    }
  );

  const mutation = useMutation(sendMessage, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleSendMessage = async (text) => {
    await mutation.mutateAsync({ conversationId, text });
  };

  useEffect(() => {
    // Load the initial conversation or set a default one
    setConversationId('default-conversation-id'); // Replace with actual logic to get conversation ID
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <ChatWindow messages={messages} />
      <InputBox onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;