import type{ Message, Chat } from '../../shared/types';
import { useLocalStorage } from './useLocalStorage';

export const useChat = (chatId: string) => {
  const [chats] = useLocalStorage<Chat[]>('chats', []);
  const [messages, setMessages] = useLocalStorage<Record<string, Message[]>>('messages', {});

  const currentChat = chats.find(chat => chat.id === chatId) || null;
  const chatMessages = messages[chatId] || [];

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      status: 'delivered',
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));
  };

  return {
    currentChat,
    messages: chatMessages,
    sendMessage,
  };
};