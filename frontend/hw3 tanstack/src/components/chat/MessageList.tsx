import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import MessageBubble from './MessageBubble';

export default function MessageList() {
  const activeId = useChatStore((s) => s.activeChatId);
  const chat = useChatStore((s) =>
    s.chats.find((c) => c.id === activeId),
  ) as any;

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  if (!chat)
    return (
      <p className="m-auto text-text-secondary">
        Выберите чат, чтобы начать переписку
      </p>
    );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
      {chat.messages?.map((m: any) => (
        <MessageBubble
          key={m.id}
          message={m}
          isMine={m.author === 'me'}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
