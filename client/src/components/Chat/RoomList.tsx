import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { convertURL } from 'utils/convertURL';
import { RoomListProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/RoomList.module.scss';

export default function RoomList({ setSelectedRoom }: RoomListProps) {
  const user = useSelector((state: RootState) => state.user.user);

  const onRoomCardClicked = () => {
    setSelectedRoom('roomId');
  };

  return (
    <nav className={styles.RoomList}>
      <button>새 메세지 보내기</button>
      <div className={styles.RoomCard} onClick={onRoomCardClicked}>
        {user?.profile ? (
          <img src={convertURL(user?.profile)} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <div className={styles.info}>
          <h3>{user.name}</h3>
          <p>
            가장 마지막 메세지가 예시로 잘려서 보여집니다 이렇게 말이죠. 만약에
            더 메세지가 길어진다면 어떨까요 이렇게 말이죠
          </p>
        </div>
      </div>
    </nav>
  );
}
