import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { convertURL } from 'utils/convertURL';
import convertMessageTime from 'utils/convertMessageTime';
import { ChatRoomProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/ChatRoom.module.scss';

export default function ChatRoom({ selectedRoom }: ChatRoomProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const [content, setContent] = useState<string>('');

  return (
    <section className={styles.ChatRoom}>
      {selectedRoom === '' ? (
        <>
          <h3>가족에게 메세지를 보내보세요</h3>
          <button>메세지 보내기</button>
        </>
      ) : (
        <>
          <div className={styles.info}>
            {user?.profile ? (
              <img src={convertURL(user?.profile)} alt="사용자 프로필" />
            ) : (
              <FaUserCircle />
            )}
            <h2>{user.name}</h2>
          </div>
          <div className={styles.chatContent}>
            <div className={styles.chat}>
              {user?.profile ? (
                <img src={convertURL(user?.profile)} alt="사용자 프로필" />
              ) : (
                <FaUserCircle />
              )}
              <div className={styles.chatBubbleLeft}>
                <p>안녕하세요</p>
              </div>
              <span>{convertMessageTime(String(new Date(Date.now())))}</span>
            </div>
            <div className={styles.myChat}>
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
            </div>
          </div>
          <div className={styles.chatInput}>
            <textarea onChange={(e) => setContent(e.currentTarget.value)} />
            <button>전송</button>
          </div>
        </>
      )}
    </section>
  );
}
