import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { FamilyRequestAPI } from 'api/FamilyRequestAPI';
import { convertURL } from 'utils/convertURL';
import { UserBoxProps } from 'views/family';
import { FaUserCircle } from 'react-icons/fa';
import { IoPersonAdd } from 'react-icons/io5';

import styles from 'styles/components/Family/UserBox.module.scss';

export default function UserBox({ messageRef, user }: UserBoxProps) {
  const curUser = useSelector((state: RootState) => state.user.user);

  const onRequestClicked = async (requestee: string) => {
    try {
      await FamilyRequestAPI.sendFamilyRequest({
        requesterId: curUser._id,
        requesteeId: requestee,
      });

      const message = messageRef.current!;
      message.innerHTML = '성공적으로 가족초대를 보냈습니다';
    } catch (err) {
      const message = messageRef.current!;
      message.innerHTML = '오류가 발생했습니다. 다시 시도해 주세요. ' + err;
    }
  };

  return (
    <div className={styles.UserBox}>
      {user.profile ? (
        <img src={convertURL(user.profile)} alt="사용자 프로필 사진" />
      ) : (
        <FaUserCircle />
      )}
      <span>{user.name}</span>
      <button
        className={styles.requestBtn}
        onClick={() => onRequestClicked(user.userId)}
      >
        <IoPersonAdd />
      </button>
    </div>
  );
}
