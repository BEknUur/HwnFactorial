import { useChatStore } from "../../store/chatStore";
export default function ChatHeader() {
  const activeId = useChatStore((s) => s.activeChatId);
  const chat = useChatStore((s) =>
    s.chats.find((c) => c.id === activeId),
  );

  return (
  <header
  className="
    h-14 px-4 flex items-center
    border-b border-border-color   dark:border-dark-border
    bg-bg-primary                  dark:bg-dark-panel
    text-text-primary              dark:text-dark-text
  "
>
      {chat ? (
        <>
          <span className="font-medium">{chat.title}</span>
          {chat.isAI && (
            <span className="ml-2 text-xs bg-primary text-white rounded-md px-1.5">
              ИИ
            </span>
          )}
        </>
      ) : (
        <span>Выберите чат</span>
      )}
    </header>
  );
}
