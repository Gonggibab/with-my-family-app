const webSocketInitiate = () => {
  const socket = io('http://localhost:5000/');

  socket.emit('chat', {
    chatId: 'testChatId',
    userId: 'testUserId',
    name: 'VSCode',
    message: 'string',
  });

  socket.on('chat', function (data) {
    console.log(data);
  });
};

import { io } from 'socket.io-client';

import HttpRequest from 'api/HttpRequest';

let socket;

export const WebSocketAPI = {
  login: () => {
    socket = io('http://localhost:5000/');
  },
  getFamilyRequest: (userId: string) => {
    return HttpRequest.post('/api/familyRequest/getRequest', { userId });
  },
  deleteFamilyRequest: (requestId: string) => {
    return HttpRequest.post('/api/familyRequest/deleteRequest', { requestId });
  },
};
