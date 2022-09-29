import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { RealtionshipAPI } from 'api/RelationshipAPI';
import { RequestBoxProps } from 'views/family';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Family/RequestBox.module.scss';
import { FamilyRequestAPI } from 'api/FamilyRequestAPI';

export default function RequestBox({
  fetchFamilyRequest,
  fetchFamilyData,
  request,
}: RequestBoxProps) {
  const curUser = useSelector((state: RootState) => state.user.user);

  const onAcceptClicked = async () => {
    try {
      await RealtionshipAPI.addRelationship({
        user1Id: curUser._id,
        user2Id: request.requesterId,
      });
      await FamilyRequestAPI.deleteFamilyRequest(request.requestId);
      fetchFamilyRequest();
      fetchFamilyData();
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const onRejectClicked = async () => {
    try {
      await FamilyRequestAPI.deleteFamilyRequest(request.requestId);
      fetchFamilyRequest();
      fetchFamilyData();
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  return (
    <div className={styles.RequestBox}>
      {request.profile ? (
        <img src={request.profile} alt="사용자 프로필 사진" />
      ) : (
        <FaUserCircle />
      )}
      <div className={styles.info}>
        <span>{request.name}님이</span>
        <span>가족요청을 보냈습니다</span>
      </div>
      <button className={styles.acceptBtn} onClick={onAcceptClicked}>
        수락
      </button>
      <button className={styles.rejectBtn} onClick={onRejectClicked}>
        거절
      </button>
    </div>
  );
}
