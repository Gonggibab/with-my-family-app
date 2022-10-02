import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import {
  setFamilies,
  setFamilyRequests,
  setIsLogin,
  setUser,
} from 'redux/_slices/userSlice';
import { UserAPI } from 'api/UserAPI';
import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import PostBox from 'components/Profile/PostBox';

import styles from 'styles/views/Profile.module.scss';
import { FaUserCircle } from 'react-icons/fa';
import { RelationshipAPI } from 'api/RelationshipAPI';

type PostData = {
  _id: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type PostBoxData = {
  postId: string;
  filePath: string;
};

type UserData = {
  _id: string;
  email: string;
  birthday?: string;
  name: string;
  profile?: string;
  role?: number;
  postCount?: number;
  relationCount?: number;
};

export type PostBoxProps = {
  postId: string;
  filePath: string;
};

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.user.user);
  const [userData, setUserData] = useState<UserData>();
  const [postBoxes, setPostBoxes] = useState<PostBoxData[]>([]);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getUserData(id);
    }

    return () => {};
  }, [user]);

  const getUserData = async (userId: string) => {
    try {
      dispatch(setIsLoading(true));
      let userData: UserData;
      if (user._id === userId) {
        userData = user;
        setIsMyProfile(true);
      } else {
        const userRes = await UserAPI.getUser(userId);
        userData = userRes.data.user;
      }

      const postRes = await PostAPI.countUserPost(userData._id);
      const relationRes = await RelationshipAPI.countRelationship(userData._id);

      setUserData({
        ...userData,
        postCount: postRes.data.count,
        relationCount: relationRes.data.count,
      });

      getUserPosts(userData._id);
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const getUserPosts = async (userId: string) => {
    try {
      const postRes = await PostAPI.getByUser(userId);
      const posts: PostData[] = postRes.data.posts;

      const postBoxData = [];
      for (const post of posts) {
        const postId = post._id;
        const mediaRes = await MediaAPI.getByPost(postId);
        const filePath = mediaRes.data.media[0].filePath;

        postBoxData.push({
          postId: postId,
          filePath: filePath,
        });
      }
      setPostBoxes(postBoxData);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const onLogoutClicked = async () => {
    try {
      await UserAPI.logout();
      dispatch(setIsLogin(false));
      dispatch(
        setUser({
          _id: '',
          email: '',
          birthday: '',
          name: '',
          profile: '',
          role: 0,
        })
      );
      dispatch(setFamilies([]));
      dispatch(setFamilyRequests([]));
      navigate('/login');
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요 ' + err);
    }
  };

  const renderPostBoxes = postBoxes.map((postBox: PostBoxData) => {
    return (
      <PostBox
        key={postBox.postId}
        postId={postBox.postId}
        filePath={postBox.filePath}
      />
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.userProfile}>
        <div className={styles.userImage}>
          {userData?.profile ? (
            <img src={userData.profile} alt="사용자 프로필 사진" />
          ) : (
            <FaUserCircle />
          )}
        </div>

        <div className={styles.userInfo}>
          <h3>{userData?.name}</h3>
          <div className={styles.userNumbers}>
            <div className={styles.userPostNum}>
              <h4>게시물</h4>
              <span>{userData?.postCount}</span>
            </div>
            <div className={styles.userFamilyNum}>
              <h4>가족</h4>
              <span>{userData?.relationCount}</span>
            </div>
          </div>
          <div className={styles.userButtons}>
            {isMyProfile && (
              <>
                {' '}
                <button className={styles.profileEditBtn}>계정 관리</button>
                <button
                  className={styles.logoutBtn}
                  onClick={() => onLogoutClicked()}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <hr></hr>
      <div className={styles.userPosts}>{renderPostBoxes}</div>
    </div>
  );
}
