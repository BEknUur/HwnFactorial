import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatList } from './ui/ChatList/ChatList';
import { ChatWindow } from './ui/ChatWindow/ChatWindow';

export const App = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 border-r border-gray-200">
          <ChatList activeChat={activeChat} onSelectChat={setActiveChat} />
        </div>
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/chat/:chatId" element={<ChatWindow />} />
            <Route path="*" element={
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a chat to start messaging</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};