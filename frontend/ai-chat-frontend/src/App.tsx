import Sidebar from './components/layout/SideBar';
import ChatArea from './components/layout/ChatArea';
import useApplyTheme from './hooks/useApplyTheme';

export default function App() {
   useApplyTheme();  
  return (
    <div className="w-screen h-screen flex">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
