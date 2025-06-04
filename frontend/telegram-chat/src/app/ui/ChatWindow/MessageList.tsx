import type { Message } from "../../../shared/types";
import { MessageItem } from "./MessageItem";
import { useEffect,useRef } from "react";

type MessageListProps={
    messages:Message[];
}

export const MessageList=({messages}:MessageListProps)=>{
    const endRef=useRef<HTMLDivElement>(null);
    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior:'smooth'});
    },[messages]);


     return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="space-y-3">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}