import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { ChatRoomData } from 'redux/_slices/userSlice';
import { socket, WebSocketAPI } from 'api/WebSocketAPI';
import { MessageAPI } from 'api/MessageAPI';
import { convertURL } from 'utils/convertURL';
import convertMessageTime from 'utils/convertMessageTime';
import { ChatRoomProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/ChatRoom.module.scss';

type MessageData = {
  chatId: string;
  message: string;
  userId: string;
  profile: string;
  createdAt: string;
  haventRead: string[];
  isMyMsg: boolean;
};

export default function ChatRoom({ selectedRoom }: ChatRoomProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [inCommingMsg, setInCommingMsg] = useState<MessageData>();
  const [msgList, setMsgList] = useState<MessageData[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    console.log(msgList);
  }, [msgList]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data: MessageData) => {
        setInCommingMsg({
          chatId: data.chatId,
          message: data.message,
          userId: data.userId,
          profile: data.profile,
          haventRead: data.haventRead,
          createdAt: data.createdAt,
          isMyMsg: user._id === data.userId,
        });

        return () => {
          socket.off('message');
        };
      });
    }
  }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.value = '';
      textArea.focus();
    }

    if (selectedRoom) {
      setMsgList([]);
      fetchMsgData(selectedRoom);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (inCommingMsg && selectedRoom) {
      if (inCommingMsg.chatId === selectedRoom?.chatId) {
        setMsgList((msgList) => [
          ...msgList,
          {
            chatId: inCommingMsg.chatId,
            message: inCommingMsg.message,
            userId: inCommingMsg.userId,
            profile: inCommingMsg.profile,
            haventRead: inCommingMsg.haventRead.filter(
              (id: string) => id !== user._id
            ),
            createdAt: inCommingMsg.createdAt,
            isMyMsg: user._id === inCommingMsg.userId,
          },
        ]);
      }
      setInCommingMsg(undefined);
    }
  }, [inCommingMsg, selectedRoom]);

  const fetchMsgData = async (room: ChatRoomData) => {
    await MessageAPI.readMessagebyChatId({
      chatId: room.chatId,
      userId: user._id,
    });
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
          haventRead: msg.haventRead.map((user: any) => user.userId),
          isMyMsg: user._id === msg.userId,
        },
      ]);
    }
  };

  const onMessageSendClicked = () => {
    if (message) {
      const msgData = {
        chatId: selectedRoom?.chatId!,
        message: message,
        userId: user._id,
        profile: user.profile,
        haventRead: selectedRoom?.users.map((user) => user.userId),
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
        <span>{msg.haventRead.length !== 0 && msg.haventRead.length}</span>
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
        <span>{msg.haventRead.length !== 0 && msg.haventRead.length}</span>
      </div>
    );
  });

  return (
    <section className={styles.ChatRoom}>
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
    </section>
  );
}
