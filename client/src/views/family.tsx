import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import { UserAPI } from 'api/UserAPI';
import { FamilyRequestAPI } from 'api/FamilyRequestAPI';
import { RealtionshipAPI } from 'api/RelationshipAPI';
import UserBox from 'components/Family/UserBox';
import RequestBox from 'components/Family/RequestBox';
import FamilyBox from 'components/Family/FamilyBox';

import styles from 'styles/views/Family.module.scss';

type UserInfo = {
  userId: string;
  name: string;
  profile: string;
};

type FamilyRequests = {
  requestId: string;
  requesterId: string;
  name: string;
  profile: string;
};

type FamilyData = {
  relationId: string;
  name: string;
  profile: string;
  relationship: string;
};

export type UserBoxProps = {
  messageRef: React.RefObject<HTMLSpanElement>;
  user: UserInfo;
};

export type RequestBoxProps = {
  fetchFamilyRequest: () => void;
  fetchFamilyData: () => void;
  request: FamilyRequests;
};

export type FamilyBoxProps = {
  fetchFamilyRequest: () => void;
  fetchFamilyData: () => void;
  family: FamilyData;
};

export default function Friends() {
  const dispatch = useDispatch();
  const messageRef = useRef<HTMLSpanElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUsers, setFoundUsers] = useState<UserInfo[]>([]);
  const [familyRequests, setFamilyRequests] = useState<FamilyRequests[]>([]);
  const [families, setFamilies] = useState<FamilyData[]>([]);

  useEffect(() => {
    if (user._id) {
      fetchFamilyRequest();
      fetchFamilyData();
    }
  }, [user]);

  const fetchFamilyRequest = async () => {
    try {
      dispatch(setIsLoading(true));
      const reqRes = await FamilyRequestAPI.getFamilyRequest(user._id);
      const requestList = [];
      for (const request of reqRes.data.request) {
        requestList.push({
          requestId: request._id,
          requesterId: request.requesterId._id,
          name: request.requesterId.name,
          profile: request.requesterId.profile,
        });
      }
      setFamilyRequests(requestList);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const fetchFamilyData = async () => {
    try {
      dispatch(setIsLoading(true));
      const reqRelation = await RealtionshipAPI.getRelationship(user._id);
      const relationList = [];
      for (const relation of reqRelation.data.relationship) {
        relationList.push({
          relationId: relation._id,
          name: relation.familyId.name,
          profile: relation.familyId.profile,
          relationship: relation.relationship,
        });
      }
      setFamilies(relationList);
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const onSearchClicked = async (str: string) => {
    try {
      dispatch(setIsLoading(true));
      const userRes = await UserAPI.searchUser(str);
      const relationRes = await RealtionshipAPI.getRelationship(user._id);
      const relationIdList = [];
      for (const relation of relationRes.data.relationship) {
        relationIdList.push(relation.familyId._id);
      }

      const userList = [];
      for (const userData of userRes.data.user) {
        if (userData._id === user._id) continue;
        if (relationIdList.includes(userData._id)) continue;
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
    return (
      <RequestBox
        key={request.requestId}
        fetchFamilyRequest={fetchFamilyRequest}
        fetchFamilyData={fetchFamilyData}
        request={request}
      />
    );
  });

  const renderFamilyList = families.map((family) => {
    return (
      <FamilyBox
        key={family.relationId}
        fetchFamilyRequest={fetchFamilyRequest}
        fetchFamilyData={fetchFamilyData}
        family={family}
      />
    );
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
