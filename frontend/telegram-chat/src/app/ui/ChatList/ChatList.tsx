import type { Chat } from "../../../shared/types";
import { SearchBar } from "./SearchBar";
import { ChatItem } from "./ChatItem";
import { useState } from "react";


type ChatListProps={
    activeChat:string | null 
    onSelectChat:(id:string )=> void;
};

const mockChats:Chat[]=[
    {
        id:'1',
        name:'Beknur',
        type:'human',
        lastMessage:'Salam Brat!',
        isOnline:true,
        unReadCount:2,
        avatar:''
    },

    {
        id:'2',
        name:'Bekzat',
        type:'human',
        lastMessage:'Assalaymagaleykym brat!',
        isOnline:true,
        unReadCount:4,
        avatar:''
    },
    {
    id: '3',
    name: 'AI Assistant',
    type: 'ai',
    lastMessage: 'How can I help you today?',
    unReadCount: 0,
    avatar: '',
  }

]

export const ChatList=({activeChat,onSelectChat}:ChatListProps)=>{
    const [searchTerm,setSearchTerm]=useState('')
    const [chats]=useState<Chat[]>(mockChats)
    
    const filteredChats=chats.filter(chat=>chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const humanChats=filteredChats.filter(chat=>chat.type==='human');
    const aiChats=filteredChats.filter(chat=>chat.type==='ai');
    
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-80">
      <div className="p-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-gray-500">People</h3>
          {humanChats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
        
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-gray-500">AI Assistants</h3>
          {aiChats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          onClick={() => console.log('New chat created')}
        >
          New Chat
        </button>
      </div>
    </div>
    )
}
