import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import { FamilyData, FamilyRequestsData } from 'redux/_slices/userSlice';
import { UserAPI } from 'api/UserAPI';
import fetchFamilyRequest from 'utils/fetchFamilyRequest';
import fetchFamilyData from 'utils/fetchFamilyData';
import UserBox from 'components/Family/UserBox';
import RequestBox from 'components/Family/RequestBox';
import FamilyBox from 'components/Family/FamilyBox';

import styles from 'styles/views/Family.module.scss';

type UserInfo = {
  userId: string;
  name: string;
  profile: string;
};

export type UserBoxProps = {
  messageRef: React.RefObject<HTMLSpanElement>;
  user: UserInfo;
};

export type RequestBoxProps = {
  request: FamilyRequestsData;
};

export type FamilyBoxProps = {
  family: FamilyData;
};

export default function Friends() {
  const dispatch = useDispatch();
  const messageRef = useRef<HTMLSpanElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const familyRequests = useSelector(
    (state: RootState) => state.user.familyRequests
  );
  const families = useSelector((state: RootState) => state.user.families);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUsers, setFoundUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    if (user._id) {
      fetchFamilyRequest(user._id, dispatch);
      fetchFamilyData(user._id, dispatch);
    }
  }, [user]);

  const onSearchClicked = async (str: string) => {
    try {
      dispatch(setIsLoading(true));
      const userRes = await UserAPI.searchUser(str);
      const familyIdList = [];
      for (const family of families) {
        familyIdList.push(family.userId);
      }

      const userList = [];
      for (const userData of userRes.data.user) {
        if (userData._id === user._id) continue;
        if (familyIdList.includes(userData._id)) continue;
        userList.push({
          userId: userData._id,
          name: userData.name,
          profile: userData.profile,
        });
      }
      setFoundUsers(userList);

      const message = messageRef.current!;
      if (userList.length === 0) {
        message.innerHTML = '검색결과가 없습니다';
      } else {
        message.innerHTML = '';
      }
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const renderUserList = foundUsers.map((user) => {
    return <UserBox key={user.userId} messageRef={messageRef} user={user} />;
  });

  const renderRequestList = familyRequests.map((request) => {
    return <RequestBox key={request.requestId} request={request} />;
  });

  const renderFamilyList = families.map((family) => {
    return <FamilyBox key={family.relationId} family={family} />;
  });

  return (
    <div className={styles.container}>
      <div className={styles.searchFamily}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="찾을 사용자 이메일을 입력하세요"
            onChange={(e) => setSearchEmail(e.currentTarget.value)}
          />
          <button
            className={styles.searchBtn}
            onClick={() => onSearchClicked(searchEmail)}
          >
            검색
          </button>
        </div>
        <span className={styles.message} ref={messageRef} />
        <div className={styles.foundUsers}>{renderUserList}</div>
      </div>
      <hr />
      <div className={styles.requestList}>
        {familyRequests.length === 0 ? (
          <span>가족 요청이 없습니다</span>
        ) : (
          renderRequestList
        )}
      </div>
      <hr />
      <div className={styles.familyList}>{renderFamilyList}</div>
    </div>
  );
}
