import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { convertURL } from 'utils/convertURL';
import { RoomListProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/RoomList.module.scss';
import { WebSocketAPI } from 'api/WebSocketAPI';

export default function RoomList({
  selectedRoom,
  setSelectedRoom,
  setIsNewChatMenu,
}: RoomListProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const chatRooms = useSelector((state: RootState) => state.user.chatRooms);

  const renderRoomCard = chatRooms.map((room) => {
    const onRoomCardClicked = async () => {
      if (room.chatId !== selectedRoom?.chatId) {
        const joinData = {
          userId: user._id,
          participantIds: room.users.map((user) => user.userId),
        };
        WebSocketAPI.joinRoom(joinData);

        setSelectedRoom({
          chatId: room.chatId,
          users: room.users,
        });
      }
    };

    return (
      <div
        className={
          selectedRoom?.chatId === room.chatId
            ? `${styles.RoomCard} ${styles.active}`
            : `${styles.RoomCard}`
        }
        key={room.chatId}
        onClick={onRoomCardClicked}
      >
        {room.users[0].profile ? (
          <img src={convertURL(room.users[0].profile)} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <div className={styles.info}>
          <h3>
            {room.users[0].relationship
              ? room.users[0].relationship
              : room.users[0].name}
          </h3>
          <p>{room.lastChat}</p>
        </div>
        {room.unReadMsgs?.length !== 0 && (
          <span className={styles.unReadCount}>{room.unReadMsgs?.length}</span>
        )}
      </div>
    );
  });

  return (
    <nav className={styles.RoomList}>
      <button onClick={() => setIsNewChatMenu(true)}>새 메세지 보내기</button>
      {renderRoomCard}
    </nav>
  );
}
