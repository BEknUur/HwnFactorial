import { useState } from "react";
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';


type MessageInputProps={
    onSend:(text:string)=>void;
}

export const MessageInput=({onSend}:MessageInputProps)=>{
    const [message,setMessage]=useState('');

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        if(message.trim()){
            onSend(message);
            setMessage('');
        }

    };
    return(

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
          disabled={!message.trim()}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
    )
        

    


}