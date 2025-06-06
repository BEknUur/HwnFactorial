import ChatHeader from '../chat/ChatHeader';
import MessageList from '../chat/MessageList'
import MessageInput from '../chat/MessageInput';

export default function ChatArea() {
  return (
    <section className="flex-1 flex flex-col bg-bg-secondary dark:bg-dark-bg  " >
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </section>
  );
}
