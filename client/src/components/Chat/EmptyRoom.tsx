import { EmptyRoomProps } from 'views/chat';

import styles from 'styles/components/Chat/EmptyRoom.module.scss';

export default function EmptyRoom({ setIsNewChatMenu }: EmptyRoomProps) {
  return (
    <section className={styles.EmptyRoom}>
      <h3>가족에게 메세지를 보내보세요</h3>
      <button onClick={() => setIsNewChatMenu(true)}>메세지 보내기</button>
    </section>
  );
}
