import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { RelationshipAPI } from 'api/RelationshipAPI';
import { RequestBoxProps } from 'views/family';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Family/RequestBox.module.scss';
import { FamilyRequestAPI } from 'api/FamilyRequestAPI';
import fetchFamilyRequest from 'utils/fetchFamilyRequest';
import fetchFamilyData from 'utils/fetchFamilyData';

export default function RequestBox({ request }: RequestBoxProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const onAcceptClicked = async () => {
    try {
      await RelationshipAPI.addRelationship({
        user1Id: user._id,
        user2Id: request.requesterId,
      });
      await FamilyRequestAPI.deleteFamilyRequest(request.requestId);
      fetchFamilyRequest(user._id, dispatch);
      fetchFamilyData(user._id, dispatch);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const onRejectClicked = async () => {
    try {
      await FamilyRequestAPI.deleteFamilyRequest(request.requestId);
      fetchFamilyRequest(user._id, dispatch);
      fetchFamilyData(user._id, dispatch);
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
