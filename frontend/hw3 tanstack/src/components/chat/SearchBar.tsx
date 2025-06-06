import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';

interface Hit { id: string; index: number }

export default function SearchBar({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const idxRef = useRef(0);

  const chat = useChatStore((s) =>
    s.chats.find((c) => c.id === s.activeChatId),
  ) as any;

  useEffect(() => {
    if (!q.trim()) return setHits([]);
    const list: Hit[] =
      chat?.messages?.flatMap((m: any, i: number) =>
        m.content.toLowerCase().includes(q.toLowerCase())
          ? [{ id: m.id, index: i }]
          : [],
      ) ?? [];
    setHits(list);
    idxRef.current = 0;
  }, [q]);

  useEffect(() => {
    if (!hits.length) return;
    const el = document.getElementById(hits[idxRef.current].id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [hits]);

  const next = () => {
    if (!hits.length) return;
    idxRef.current = (idxRef.current + 1) % hits.length;
    const el = document.getElementById(hits[idxRef.current].id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2
                    bg-bg-primary dark:bg-dark-panel
                    border border-border-color dark:border-dark-border
                    rounded-xl shadow px-4 py-2 flex gap-2 items-center z-10">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск"
        className="bg-transparent outline-none text-sm w-40"
      />
      <span className="text-xs">
        {hits.length ? `${idxRef.current + 1}/${hits.length}` : '0'}
      </span>
      <button onClick={next} className="text-sm">⏎</button>
      <button onClick={onClose} className="text-lg">&times;</button>
    </div>
  );
}
