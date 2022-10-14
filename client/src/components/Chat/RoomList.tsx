import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { convertURL } from 'utils/convertURL';
import { RoomListProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/RoomList.module.scss';
import { WebSocketAPI } from 'api/WebSocketAPI';

export default function RoomList({
  setSelectedRoom,
  setIsNewChatMenu,
}: RoomListProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const chatRooms = useSelector((state: RootState) => state.user.chatRooms);

  const renderRoomCard = chatRooms.map((room) => {
    const onRoomCardClicked = async () => {
      const joinData = {
        userId: user._id,
        name: room.name,
        participantId: room.userId,
      };
      WebSocketAPI.joinRoom(joinData);
      setSelectedRoom({
        chatId: room.chatId,
        userId: room.userId,
        name: room.name,
        profile: room.profile,
      });
    };

    return (
      <div
        className={styles.RoomCard}
        key={room.chatId}
        onClick={onRoomCardClicked}
      >
        {room.profile ? (
          <img src={convertURL(room.profile)} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <div className={styles.info}>
          <h3>{room.name}</h3>
          <p>
            가장 마지막 메세지가 예시로 잘려서 보여집니다 이렇게 말이죠. 만약에
            더 메세지가 길어진다면 어떨까요 이렇게 말이죠
          </p>
        </div>
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
