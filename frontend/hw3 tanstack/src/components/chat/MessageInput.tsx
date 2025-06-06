import { useChatStore } from '../../store/chatStore';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';

export default function MessageInput() {
  const activeId = useChatStore((s) => s.activeChatId);
  const send = useChatStore((s) => s.sendMessage);
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!activeId || !value.trim()) return;
    send(activeId, value.trim(), 'me');
    setValue('');

   
    const chat = useChatStore
      .getState()
      .chats.find((c) => c.id === activeId);
    if (chat?.isAI) {
      setTimeout(() => {
        send(activeId, `${value}? Интересный вопрос!`, 'bot');
      }, 1200);
    }
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
   <footer
  className="
    p-3
    border-t border-border-color   dark:border-dark-border
    bg-bg-primary                  dark:bg-dark-panel
  "
>
      <div className="flex items-end gap-2">
        <TextareaAutosize
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Введите сообщение"
          maxRows={6}
          className="
        flex-1 resize-none px-3 py-2 text-sm
        border border-border-color   dark:border-dark-border
        rounded-xl focus:outline-primary
        bg-bg-primary                dark:bg-dark-panel
        text-text-primary            dark:text-dark-text
      "
        />
        <button
          onClick={handleSend}
           className="
        py-2 px-4 rounded-xl
        bg-primary text-white
        disabled:opacity-40
      "
    
          disabled={!value.trim() || !activeId}
        >
          Отправить
        </button>
      </div>
    </footer>
  );
}
