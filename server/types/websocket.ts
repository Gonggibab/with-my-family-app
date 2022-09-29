export interface ServerToClientEvents {
  chat: (name: string) => void;
}

export interface ClientToServerEvents {
  chat: (data: ChatData) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  name: string;
  userId: string;
}

export type ChatData = {
  chatId: string;
  userId: string;
  name: string;
  message: string;
};
