import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { socket, WebSocketAPI } from 'api/WebSocketAPI';
import { convertURL } from 'utils/convertURL';
import convertMessageTime from 'utils/convertMessageTime';
import { ChatRoomProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/ChatRoom.module.scss';
import { MessageAPI } from 'api/MessageAPI';
import { ChatRoomData } from 'redux/_slices/userSlice';

type MessageData = {
  chatId: string;
  message: string;
  userId: string;
  profile: string;
  createdAt: string;
  unReadCount: number;
  isMyMsg: boolean;
};

export default function ChatRoom({
  selectedRoom,
  setIsNewChatMenu,
}: ChatRoomProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [msgList, setMsgList] = useState<MessageData[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Reset socket message event and message state on chat room change
    if (socket) socket.off('message');
    setMsgList([]);

    if (socket && selectedRoom) {
      fetchMsgData(selectedRoom);
    }

    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.value = '';
      textArea.focus();
    }
  }, [selectedRoom]);

  const fetchMsgData = async (room: ChatRoomData) => {
    const msgRes = await MessageAPI.findMessagebyChatId(room.chatId);
    const messages = msgRes.data.message;
    for (const msg of messages) {
      setMsgList((msgList) => [
        ...msgList,
        {
          chatId: msg.chatId,
          message: msg.message,
          userId: msg.userId,
          profile: room.users[0].profile!,
          createdAt: msg.createdAt,
          unReadCount: msg.haventRead.length,
          isMyMsg: user._id === msg.userId,
        },
      ]);
    }

    socket.on('message', (data) => {
      if (data.chatId === selectedRoom?.chatId) {
        setMsgList((msgList) => [
          ...msgList,
          {
            chatId: data.chatId,
            message: data.message,
            userId: data.userId,
            profile: data.profile,
            unReadCount: data.recieverIds.length,
            createdAt: data.createdAt,
            isMyMsg: user._id === data.userId,
          },
        ]);
      }
    });
  };

  const onMessageSendClicked = () => {
    if (message) {
      const msgData = {
        chatId: selectedRoom?.chatId!,
        message: message,
        userId: user._id,
        profile: user.profile,
        recieverIds: selectedRoom?.users.map((user) => user.userId),
      };
      WebSocketAPI.sendMessage(msgData);
      setMessage('');

      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.value = '';
        textArea.focus();
      }
    }
  };

  const renderMessages = msgList.map((msg, idx) => {
    return msg.isMyMsg ? (
      <div className={styles.myChat} key={idx}>
        <span>{msg.unReadCount}</span>
        <span>{convertMessageTime(msg.createdAt)}</span>
        <div className={styles.chatBubbleRight}>
          <p>{msg.message}</p>
        </div>
      </div>
    ) : (
      <div className={styles.chat} key={idx}>
        {msg?.profile ? (
          <img src={convertURL(msg?.profile)} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <div className={styles.chatBubbleLeft}>
          <p>{msg.message}</p>
        </div>
        <span>{convertMessageTime(msg.createdAt)}</span>
      </div>
    );
  });

  return (
    <section className={styles.ChatRoom}>
      {!selectedRoom ? (
        <>
          <h3>가족에게 메세지를 보내보세요</h3>
          <button onClick={() => setIsNewChatMenu(true)}>메세지 보내기</button>
        </>
      ) : (
        <>
          <div className={styles.info}>
            {selectedRoom?.users[0].profile ? (
              <img
                src={convertURL(selectedRoom?.users[0].profile)}
                alt="사용자 프로필"
              />
            ) : (
              <FaUserCircle />
            )}
            <h2>
              {selectedRoom?.users[0].relationship
                ? selectedRoom.users[0].relationship
                : selectedRoom?.users[0].name}
            </h2>
          </div>
          <div className={styles.chatContent}>{renderMessages}</div>
          <div className={styles.chatInput}>
            <textarea
              onChange={(e) => setMessage(e.currentTarget.value)}
              ref={textAreaRef}
            />
            <button onClick={onMessageSendClicked}>전송</button>
          </div>
        </>
      )}
    </section>
  );
}
