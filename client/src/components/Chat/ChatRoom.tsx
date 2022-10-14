import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { convertURL } from 'utils/convertURL';
import convertMessageTime from 'utils/convertMessageTime';
import { ChatRoomProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/ChatRoom.module.scss';
import { WebSocketAPI } from 'api/WebSocketAPI';

export default function ChatRoom({
  selectedRoom,
  setIsNewChatMenu,
}: ChatRoomProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const [messageList, setMessageList] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const onMessageSendClicked = () => {
    const msgData = {
      userId: user._id,
      chatId: selectedRoom?.chatId!,
      message: message,
    };
    WebSocketAPI.sendMessage(msgData);
  };

  // const renderMessages = messageList.map(msg => {
  //   return()
  // })

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
            {selectedRoom?.profile ? (
              <img
                src={convertURL(selectedRoom?.profile)}
                alt="사용자 프로필"
              />
            ) : (
              <FaUserCircle />
            )}
            <h2>{selectedRoom.name}</h2>
          </div>
          <div className={styles.chatContent}>
            {/* <div className={styles.chat}>
              {user?.profile ? (
                <img src={convertURL(user?.profile)} alt="사용자 프로필" />
              ) : (
                <FaUserCircle />
              )}
              <div className={styles.chatBubbleLeft}>
                <p>안녕하세요</p>
              </div>
              <span>{convertMessageTime(String(new Date(Date.now())))}</span>
            </div> */}

            {/* <div className={styles.myChat}>
              <span>{convertMessageTime(String(new Date(Date.now())))}</span>
              <div className={styles.chatBubbleRight}>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laboriosam esse harum ea, cupiditate voluptates atque?
                  Deleniti sunt nostrum ipsam libero molestias voluptate,
                  corporis praesentium ab quasi culpa nihil velit est iusto
                  natus quam cum veniam odio dignissimos corrupti voluptatem
                  laborum distinctio. Aut quis placeat eligendi nisi neque animi
                  magni earum sapiente ducimus harum, perferendis quibusdam, id
                  cupiditate perspiciatis, voluptatum molestiae aliquid iure
                  eius. Eius!
                </p>
              </div>
            </div> */}
          </div>
          <div className={styles.chatInput}>
            <textarea onChange={(e) => setMessage(e.currentTarget.value)} />
            <button onClick={onMessageSendClicked}>전송</button>
          </div>
        </>
      )}
    </section>
  );
}
