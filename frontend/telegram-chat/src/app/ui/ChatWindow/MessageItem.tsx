import type { Message } from "../../../shared/types";

type MessageProps={
    message:Message;
};

export const MessageItem=({message}:MessageProps)=>{
    const isUser=message.sender==='user';


    return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white border border-gray-200 rounded-bl-none'
        }`}
      >
        <p>{message.text}</p>
        <div className={`text-xs mt-1 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={isUser ? 'text-blue-100' : 'text-gray-500'}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && (
            <span className="ml-1">
              {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}