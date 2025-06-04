import { useChatStore } from '../../store/chatStore';
import ChatListItem from './ChatListItem';
import { useMemo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ChatList() {
  const { chats, search, addChat, setSearch } = useChatStore();
  const [tab, setTab] = useState<'all' | 'people' | 'ai'>('all');

  const filtered = useMemo(() => {
    return chats.filter((c) => {
      const inTab =
        tab === 'all' ||
        (tab === 'people' && !c.isAI) ||
        (tab === 'ai' && c.isAI);
      const inSearch = c.title.toLowerCase().includes(search.toLowerCase());
      return inTab && inSearch;
    });
  }, [chats, search, tab]);

  return (
    <>
      
      <div className="p-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
          className="w-full px-3 py-2 rounded-lg border border-border-color text-sm"
        />
      </div>

      {/* Tabs */}
      <div className="px-3 flex gap-2 text-xs pb-2">
        {[
          { k: 'all', t: 'Все' },
          { k: 'people', t: 'Люди' },
          { k: 'ai', t: 'ИИ' },
        ].map(({ k, t }) => (
          <button
            key={k}
            onClick={() => setTab(k as any)}
            className={`px-2 py-1 rounded-lg ${
              tab === k ? 'bg-primary text-white' : 'bg-bg-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

    
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filtered.length ? (
          filtered.map((c) => <ChatListItem key={c.id} chat={c} />)
        ) : (
          <p className="text-center text-text-secondary text-sm mt-10">
            Ничего не найдено
          </p>
        )}
      </div>

      
      <button
        onClick={() => {
          const title = prompt('Название чата')?.trim();
          if (title) addChat(title);
        }}
        className="m-4 w-full py-2 flex items-center justify-center gap-1 bg-primary text-white rounded-xl"
      >
        <PlusIcon className="h-4 w-4" />
        Новый чат
      </button>
    </>
  );
}
