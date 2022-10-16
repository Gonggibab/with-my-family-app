import { useState } from 'react';

import { ChatRoomData } from 'redux/_slices/userSlice';
import RoomList from 'components/Chat/RoomList';
import EmptyRoom from 'components/Chat/EmptyRoom';
import ChatRoom from 'components/Chat/ChatRoom';
import NewChatMenu from 'components/Chat/NewChatMenu';

import styles from 'styles/views/Chat.module.scss';

export type RoomListProps = {
  selectedRoom: ChatRoomData | undefined;
  setSelectedRoom: React.Dispatch<
    React.SetStateAction<ChatRoomData | undefined>
  >;
  setIsNewChatMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export type EmptyRoomProps = {
  setIsNewChatMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ChatRoomProps = {
  selectedRoom: ChatRoomData | undefined;
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
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsNewChatMenu={setIsNewChatMenu}
        />
        {!selectedRoom ? (
          <EmptyRoom setIsNewChatMenu={setIsNewChatMenu} />
        ) : (
          <ChatRoom selectedRoom={selectedRoom} />
        )}
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
