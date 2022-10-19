import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import {
  ChatRoomData,
  setChatRooms,
  setUnreadMsgsCount,
} from 'redux/_slices/userSlice';
import { socket, WebSocketAPI, ReadMsgData } from 'api/WebSocketAPI';
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
  const dispatch = useDispatch();
  const loadCount = useRef<number>(0);
  const msgBoxRef = useRef<HTMLDivElement>(null);
  const msgBoxTopRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const chatRooms = useSelector((state: RootState) => state.user.chatRooms);
  const [inCommingMsg, setInCommingMsg] = useState<MessageData>();
  const [msgReadInfo, setMsgReadInfo] = useState<ReadMsgData>();
  const [msgList, setMsgList] = useState<MessageData[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isSendMsg, setIsSendMsg] = useState<boolean>(false);

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
      });

      socket.on('read', (data: ReadMsgData) => {
        setMsgReadInfo({
          chatId: data.chatId,
          readerId: data.readerId,
        });
      });
    }

    const observer = new IntersectionObserver((entries) => {
      if (selectedRoom) {
        if (loadCount.current !== -1 && loadCount.current > 0) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fetchMsgData(selectedRoom);
            }
          });
        }
      }
    });
    observer.observe(msgBoxTopRef.current!);

    return () => {
      socket.off('message');
      socket.off('read');
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.value = '';
      textArea.focus();
    }

    if (selectedRoom) {
      loadCount.current = 0;
      setMsgList([]);
      fetchMsgData(selectedRoom);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (inCommingMsg && selectedRoom) {
      if (inCommingMsg.chatId === selectedRoom.chatId) {
        setMsgList((msgList) => [
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
          ...msgList,
        ]);

        readMessage();
      }
      setInCommingMsg(undefined);
    }
  }, [inCommingMsg, selectedRoom]);

  useEffect(() => {
    if (msgReadInfo && selectedRoom) {
      if (msgReadInfo.chatId === selectedRoom.chatId) {
        setMsgList(
          msgList.map((msg) => {
            return {
              ...msg,
              haventRead: msg.haventRead.filter(
                (id) => id !== msgReadInfo.readerId
              ),
            };
          })
        );
      }
      setMsgReadInfo(undefined);
    }
  }, [msgReadInfo, selectedRoom]);

  useEffect(() => {
    if (isSendMsg && msgList) {
      if (msgList[0]?.isMyMsg) {
        msgBoxRef.current?.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        setIsSendMsg(false);
      }
    }
  }, [msgList.length, isSendMsg]);

  const fetchMsgData = async (room: ChatRoomData) => {
    readMessage();

    const msgRes = await MessageAPI.findMessagebyChatId({
      chatId: room.chatId,
      load: loadCount.current,
    });
    const messages = msgRes.data.message;
    if (messages.length === 20) {
      loadCount.current += 1;
    } else {
      loadCount.current = -1;
    }

    for (const msg of messages) {
      setMsgList((msgList) => [
        ...msgList,
        {
          chatId: msg.chatId,
          message: msg.message,
          userId: msg.userId,
          profile: room.users[0].profile!,
          createdAt: msg.createdAt,
          haventRead: msg.haventRead,
          isMyMsg: user._id === msg.userId,
        },
      ]);
    }
  };

  const readMessage = async () => {
    if (selectedRoom) {
      await MessageAPI.readMessagebyChatId({
        chatId: selectedRoom.chatId!,
        userId: user._id,
      });

      WebSocketAPI.readMessage({
        chatId: selectedRoom.chatId!,
        readerId: user._id,
      });

      let tempCount = 0;
      const tempList = chatRooms.map((room) => {
        if (room.chatId === selectedRoom.chatId!) {
          const tempObj = {
            ...room,
            unReadMsgs: room.unReadMsgs?.filter(
              (msg) => !msg.haventRead.includes(user._id)
            ),
          };
          tempCount += tempObj.unReadMsgs?.length!;
          return tempObj;
        } else {
          tempCount += room.unReadMsgs?.length!;
          return room;
        }
      });
      dispatch(setChatRooms(tempList));
      dispatch(setUnreadMsgsCount(tempCount));
    }
  };

  const sendMessage = () => {
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
      setIsSendMsg(true);
    }
  };

  const onEnterPressed = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
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
      <div className={styles.chatContent} ref={msgBoxRef}>
        {renderMessages}
        <div className={styles.scrollObserver} ref={msgBoxTopRef}></div>
      </div>
      <div className={styles.chatInput}>
        <textarea
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyDown={(e) => onEnterPressed(e)}
          ref={textAreaRef}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </section>
  );
}
