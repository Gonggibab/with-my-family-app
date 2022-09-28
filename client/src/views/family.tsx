import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import UserBox from 'components/Family/UserBox';
import { UserAPI } from 'api/UserAPI';

import styles from 'styles/views/Family.module.scss';
import profileDad from 'assets/images/testProfileDad.jpg';
import RequestBox from 'components/Family/RequestBox';

type UserInfo = {
  userId: string;
  name: string;
  profile: string;
};

export type UserBoxProps = {
  messageRef: React.RefObject<HTMLSpanElement>;
  user: UserInfo;
};

export default function Friends() {
  const dispatch = useDispatch();
  const messageRef = useRef<HTMLSpanElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUsers, setFoundUsers] = useState<UserInfo[]>([]);

  const onSearchClicked = async (str: string) => {
    try {
      dispatch(setIsLoading(true));
      const userRes = await UserAPI.searchUser(str);
      const userList = [];
      for (const userData of userRes.data.user) {
        if (user._id === userData._id) continue;
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
    } catch (error) {}
  };

  const renderUserList = foundUsers.map((user) => {
    return <UserBox key={user.userId} messageRef={messageRef} user={user} />;
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
        <div className={styles.foundUsers}> {renderUserList}</div>
      </div>
      <hr />
      <div className={styles.requestList}>
        <RequestBox />
      </div>
      <hr />
      <div className={styles.familyList}>
        <div className={styles.familyBox}>
          <div className={styles.familyProfile}>
            <img src={profileDad} alt="사용자 프로필" />
            <div className={styles.familyInfo}>
              <span className={styles.relationship}>아빠</span>
              <span className={styles.name}>정모씨</span>
            </div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.profileBtn}>프로필 보기</button>
            <button className={styles.messageBtn}>메세지</button>
          </div>
        </div>
      </div>
    </div>
  );
}
