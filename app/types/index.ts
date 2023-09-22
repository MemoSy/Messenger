import {  Conversation, Massage, User } from "@prisma/client";

export type FullMessageType = Massage & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[]; 
  massages: FullMessageType[]
};