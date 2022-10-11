import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import ChatRoom from 'components/Chat/ChatRoom';
import RoomList from 'components/Chat/RoomList';

import styles from 'styles/views/Chat.module.scss';

export type RoomListProps = {
  setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
};

export type ChatRoomProps = {
  selectedRoom: string;
};

export default function Chat() {
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  return (
    <div className={styles.container}>
      <div className={styles.chatBox}>
        <RoomList setSelectedRoom={setSelectedRoom} />
        <ChatRoom selectedRoom={selectedRoom} />
      </div>
    </div>
  );
}
