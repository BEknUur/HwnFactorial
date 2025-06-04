
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';



import { openaiChat } from '../lib/openai';
import { toOai } from '../utils/mapToOai';
import type { Chat, Message, MsgStatus } from '../types/chat';



interface ChatState {
  chats: Chat[];
  activeChatId?: string;
  search: string;

  addChat: (title: string, isAI?: boolean) => void;
  setActiveChat: (id: string) => void;
  setSearch: (q: string) => void;
  sendMessage: (
    chatId: string,
    content: string,
    author: 'me' | 'bot' | 'user',
    replyToId?: string,
  ) => void;
  markRead: (chatId: string) => void;
}


export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
    
      chats: [
        { id: nanoid(), title: 'GPT-4o', isAI: true,  unreadCount: 0 },
        { id: nanoid(), title: 'Grok AI', isAI: true,  unreadCount: 0 },
        { id: nanoid(), title: 'Alice',   isAI: false, unreadCount: 0 },
      ],
      activeChatId: undefined,
      search: '',

      
      addChat: (title, isAI = false) =>
        set((s) => ({
          chats: [{ id: nanoid(), title, isAI, unreadCount: 0 }, ...s.chats],
        })),

      setActiveChat: (id) => set({ activeChatId: id }),
      setSearch: (q) => set({ search: q }),

     
      sendMessage: async (chatId, content, author, replyToId) => {
        
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id !== chatId
              ? c
              : {
                  ...c,
                  lastMessage: {
                    id: nanoid(),
                    chatId,
                    content,
                    author,
                    replyToId,
                    createdAt: new Date(),
                    type: 'text',
                    status: 'sent' as MsgStatus,
                  },
                  messages: [
                    ...(c as any).messages ?? [],
                    {
                      id: nanoid(),
                      chatId,
                      content,
                      author,
                      replyToId,
                      createdAt: new Date(),
                      type: 'text',
                      status: 'sent' as MsgStatus,
                    },
                  ],
                },
          ),
        }));

       
        const chat = (get().chats as any).find((c: any) => c.id === chatId);
        if (!chat?.isAI || author !== 'me') return;

        try {
          
          let aiAnswer = '';
          if (chat.title.toLowerCase().includes('gpt-4o')) {
            
            const history = toOai(chat.messages ?? []);
            aiAnswer = await openaiChat([
              ...history,
              { role: 'user', content },
            ]);
          } else {
            
            const history = toOai(chat.messages ?? []);
            aiAnswer = await xaiChat([
              ...history,
              { role: 'user', content },
            ]);
          }

          
          set((s) => ({
            chats: s.chats.map((c) =>
              c.id !== chatId
                ? c
                : {
                    ...c,
                    lastMessage: {
                      id: nanoid(),
                      chatId,
                      content: aiAnswer,
                      author: 'bot',
                      createdAt: new Date(),
                      type: 'text',
                      status: 'sent' as MsgStatus,
                    },
                    messages: [
                      ...(c as any).messages ?? [],
                      {
                        id: nanoid(),
                        chatId,
                        content: aiAnswer,
                        author: 'bot',
                        createdAt: new Date(),
                        type: 'text',
                        status: 'sent' as MsgStatus,
                      },
                    ],
                  },
            ),
          }));
        } catch (err) {
          
          const txt = `⚠️ AI error: ${(err as Error).message}`;
          set((s) => ({
            chats: s.chats.map((c) =>
              c.id !== chatId
                ? c
                : {
                    ...c,
                    messages: [
                      ...(c as any).messages ?? [],
                      {
                        id: nanoid(),
                        chatId,
                        content: txt,
                        author: 'bot',
                        createdAt: new Date(),
                        type: 'text',
                        status: 'sent' as MsgStatus,
                      },
                    ],
                  },
            ),
          }));
        }
      },

      
      markRead: (chatId) =>
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: (c as any).messages?.map((m: Message) =>
                    m.status !== 'read' ? { ...m, status: 'read' } : m,
                  ),
                  unreadCount: 0,
                }
              : c,
          ),
        })),
    }),
    { name: 'chat-storage' },          
  ),
);
function xaiChat(arg0: any[]): string | PromiseLike<string> {
  throw new Error('Function not implemented.');
}

