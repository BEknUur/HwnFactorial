import ChatList from "../chat/ChatList";
import ThemeToggle from "../ui/ThemeToggle";

export default function Sidebar() {
  return (
    <aside
      className="
        w-80
        bg-bg-primary       dark:bg-dark-panel          /* ← фон колонки */
        border-r border-border-color dark:border-dark-border
        flex flex-col
      "
    >
      <header
        className="
          p-4 font-semibold
          border-b border-border-color dark:border-dark-border
          bg-bg-primary       dark:bg-dark-panel
          text-text-primary   dark:text-dark-text
        "
      >
        Telegram Clone
      </header>

      <ChatList />
      
      <ThemeToggle />
    </aside>
  );
}
