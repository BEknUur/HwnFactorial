export type MsgStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  chatId: string;
  author: 'me' | 'bot' | 'user';
  content: string;
  createdAt: Date;
  type?: 'text' | 'image' | 'file';
  status?: MsgStatus;
 replyToId?: string; 
}

export interface Chat {
  id: string;
  title: string;
  isAI: boolean;
  lastMessage?: Message;
  unreadCount?: number;
}
