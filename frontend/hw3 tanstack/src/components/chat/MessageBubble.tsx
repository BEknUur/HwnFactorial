import { useChatStore } from '../../store/chatStore';
import classNames from 'classnames';
import type { Message } from '../../types/chat';

export default function MessageBubble({
  message,
  isMine,
  highlight,
}: {
  message: Message;
  isMine: boolean;
  highlight?: boolean;
}) {
  const chat = useChatStore((s) =>
    s.chats.find((c) => c.id === message.chatId),
  ) as any;

  const replied = message.replyToId
    ? (chat.messages ?? []).find((m: any) => m.id === message.replyToId)
    : null;

  return (
    <div id={message.id} className={classNames('my-1 flex', isMine && 'justify-end')}>
      <div
        className={classNames(
          'max-w-[75%] rounded-xl px-4 py-2 text-sm shadow-sm',
          isMine
            ? 'bg-message-out dark:bg-dark-message-out rounded-br-none'
            : 'bg-message-in  dark:bg-dark-message-in  rounded-bl-none',
          highlight && 'ring-2 ring-primary',
        )}
      >
        {replied && (
          <div
            className="text-xs italic border-l-2 pl-2 mb-1
                       border-border-color dark:border-dark-border
                       text-text-secondary dark:text-dark-text-secondary"
          >
            {replied.content.slice(0, 50)}…
          </div>
        )}

        {message.content}

        
        {isMine && (
          <span className="ml-2 text-xs align-bottom select-none">
            {message.status === 'read' ? '✓✓' : '✓'}
          </span>
        )}
      </div>
    </div>
  );
}
