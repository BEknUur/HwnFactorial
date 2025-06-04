import type { Chat } from "../../../shared/types";


type ChatItemProps={
    chat:Chat,
    isActive:boolean,
    onClick:() =>void;
};

export const ChatItem = ({ chat, isActive, onClick }: ChatItemProps) => {
  return (
    <div 
      className={`flex items-center p-3 border-b border-telegram-border ${
        isActive ? 'bg-telegram-bg' : 'hover:bg-telegram-input'
      }`}
      onClick={onClick}
    >
      <div className="relative mr-3">
        <div className="w-12 h-12 rounded-full bg-telegram-accent flex items-center justify-center">
          {chat.name.charAt(0)}
        </div>
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-telegram-sidebar"/>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="text-white font-medium truncate">{chat.name}</h4>
          <span className="text-xs text-telegram-message-meta">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-sm text-telegram-message-meta truncate">
          {chat.lastMessage}
        </p>
      </div>
    </div>
  )
}



