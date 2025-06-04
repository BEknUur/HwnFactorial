import type { Chat } from "../../../shared/types";

type ChatHeaderProps={
    chat:Chat | null;
}
export const ChatHeader=({chat}:ChatHeaderProps)=>{
    if(!chat) return null;

    return (
    <div className="border-b border-gray-200 p-4 flex items-center bg-white">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          {chat.name.charAt(0)}
        </div>
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="ml-3">
        <h3 className="font-medium">{chat.name}</h3>
        <p className="text-xs text-gray-500">
          {chat.isOnline ? 'online' : 'last seen recently'}
        </p>
      </div>
      <div className="ml-auto flex space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    );
}
