import type { Chat } from "../../../shared/types";


type ChatItemProps={
    chat:Chat,
    isActive:boolean,
    onClick:() =>void;
};

export const ChatItem=({chat,isActive,onClick}:ChatItemProps) =>{
    return (
    <div
      className={`flex items-center p-3 cursor-pointer ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          {chat.name.charAt(0)}
        </div>
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium truncate">{chat.name}</h4>
          <span className="text-xs text-gray-500">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
          {chat.unReadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {chat.unReadCount}
            </span>
          )}
        </div>
      </div>
    </div>
    )


}

