import { useEffect } from 'react';
import { io } from 'socket.io-client';

import styles from 'styles/views/Home.module.scss';

export default function Chat() {
  useEffect(() => {
    webSocketInitiate();
  }, []);

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

  return (
    <div className={styles.container}>
      <h1>대화방 페이지 입니다.</h1>
    </div>
  );
}
