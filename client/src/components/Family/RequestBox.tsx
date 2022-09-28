import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Family/RequestBox.module.scss';
import { FamilyRequestAPI } from 'api/FamilyRequestAPI';

export default function RequestBox() {
  const curUser = useSelector((state: RootState) => state.user.user);

  const onRequestClicked = async (requestee: string) => {
    try {
      await FamilyRequestAPI.sendFamilyRequest({
        requesterId: curUser._id,
        requesteeId: requestee,
      });
    } catch (err) {}
  };

  return (
    <div className={styles.RequestBox}>
      {/* {user.profile ? (
        <img src={user.profile} alt="사용자 프로필 사진" />
      ) : ( */}
      <FaUserCircle />
      {/* )} */}
      <div className={styles.info}>
        <span>정진우님이</span>
        <span>가족요청을 보냈습니다</span>
      </div>
      <button className={styles.acceptBtn}>수락</button>
      <button className={styles.rejectBtn}>거절</button>
    </div>
  );
}
