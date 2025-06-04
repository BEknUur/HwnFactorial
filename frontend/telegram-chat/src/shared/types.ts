export type Message={
id:string,
text:string,
sender:'ai' | 'user',
timestamp:Date, 
status:'delivered' |'sent' |'read'
} 
export type Chat={
    id:string,
    name:string,
    type:'human' |'ai',
    lastMessage?:string,
    isOnline?:boolean,
    unReadCount:number, 
    avatar?:string

}