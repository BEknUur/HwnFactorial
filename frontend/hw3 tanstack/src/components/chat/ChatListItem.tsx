import {type Chat} from '../../types/chat';
import classNames from 'classnames';
import { useChatStore } from '../../store/chatStore';

interface Props {
  chat: Chat;
}

export default function ChatListItem({ chat }: Props) {
  const activeId = useChatStore((s) => s.activeChatId);
  const setActive = useChatStore((s) => s.setActiveChat);

  const last = chat.lastMessage?.content ?? '';
  const unread = chat.unreadCount ?? 0;

  return (
    <div
      onClick={() => setActive(chat.id)}
      className={classNames(
        'cursor-pointer px-4 py-3 rounded-lg hover:bg-bg-secondary',
        activeId === chat.id && 'bg-bg-secondary',
      )}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium truncate">{chat.title}</span>
        {unread > 0 && (
          <span className="ml-2 text-xs bg-primary text-white rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
            {unread}
          </span>
        )}
      </div>
      {last && (
        <p className="text-sm text-text-secondary truncate mt-0.5">{last}</p>
      )}
    </div>
  );
}
