import { Types } from 'mongoose';
import { IChat } from '../models/ChatModel';

export interface ServerToClientEvents {
  error: (data: any) => void;
  login: (
    data: (IChat & {
      _id: Types.ObjectId;
    })[]
  ) => void;
  join: (chatId: string) => void;
  message: (data: MessageData) => void;
}

export interface ClientToServerEvents {
  login: (userId: string, name: string) => void;
  join: (data: ChatJoinData) => void;
  message: (data: MessageData) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  userId: string;
  name: string;
}

export type ChatJoinData = {
  userId: string;
  participantId: string;
  chatId?: string;
};

export type MessageData = {
  userId: string;
  chatId: string;
  message: string;
};
