import { useParams } from "react-router-dom";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChat } from "../../model/useChat";

export const ChatWindow=()=>{
    const {chatId}=useParams<{chatId:string}>();
    const {messages,sendMessage,currentChat}=useChat(chatId||'');

    if(!chatId){
        return(
            <div className="flex-1 flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Select a chat to start messaging</p>
    </div>
        );
    }
    return(
         <div className="flex-1 flex flex-col h-full">
            <ChatHeader chat={currentChat}></ChatHeader>
            <MessageList messages={messages}/>
            <MessageInput onSend={sendMessage}/>

         </div>

    );

}