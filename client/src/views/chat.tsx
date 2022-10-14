import { useState } from 'react';

import { ChatRoomData } from 'redux/_slices/userSlice';
import ChatRoom from 'components/Chat/ChatRoom';
import RoomList from 'components/Chat/RoomList';
import NewChatMenu from 'components/Chat/NewChatMenu';

import styles from 'styles/views/Chat.module.scss';

export type RoomListProps = {
  setSelectedRoom: React.Dispatch<
    React.SetStateAction<ChatRoomData | undefined>
  >;
  setIsNewChatMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ChatRoomProps = {
  selectedRoom: ChatRoomData | undefined;
  setIsNewChatMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NewChatMenuProps = {
  setSelectedRoom: React.Dispatch<
    React.SetStateAction<ChatRoomData | undefined>
  >;
  setIsNewChatMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomData>();
  const [isNewChatMenu, setIsNewChatMenu] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div className={styles.chatBox}>
        <RoomList
          setSelectedRoom={setSelectedRoom}
          setIsNewChatMenu={setIsNewChatMenu}
        />
        <ChatRoom
          selectedRoom={selectedRoom}
          setIsNewChatMenu={setIsNewChatMenu}
        />
      </div>
      {isNewChatMenu && (
        <NewChatMenu
          setSelectedRoom={setSelectedRoom}
          setIsNewChatMenu={setIsNewChatMenu}
        />
      )}
    </div>
  );
}
