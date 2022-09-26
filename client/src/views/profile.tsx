import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { setIsLoading } from 'redux/_slices/appSlice';
import { UserAPI } from 'api/UserAPI';
import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import PostBox from 'components/Profile/PostBox';

import styles from 'styles/views/Profile.module.scss';
import { FaUserCircle } from 'react-icons/fa';

type PostData = {
  _id: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type MediaData = {
  _id: string;
  postId?: string;
  userId?: string;
  filename: string;
  filePath: string;
  mimeType: string;
  originalName: string;
  size: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type PostBox = {
  postId: string;
  filePath: string;
};

export type PostBoxProps = {
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
};

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const user = useSelector((state: RootState) => state.user.user);
  const [userData, setUserData] = useState<UserData>(user);
  const [postBoxes, setPostBoxes] = useState<PostBox[]>([]);

  useEffect(() => {
    if (user._id === id) {
      setUserData(user);
    } else {
      if (id) getUserData(id);
    }

    if (userData._id) {
      getUserPosts(userData._id);
    }
  }, []);

  const getUserData = async (userId: string) => {
    try {
      const userRes = await UserAPI.getUser(userId);
      const user = userRes.data.user;
      setUserData(user);
      console.log(user);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const getUserPosts = async (userId: string) => {
    dispatch(setIsLoading(true));
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
    dispatch(setIsLoading(false));
  };

  const onLogoutClicked = () => {
    UserAPI.logout().then((res) => {
      if (res.status === 400) {
        console.log('오류가 발생했습니다. 다시 시도해 주세요');
      } else {
        dispatch(setIsLogin(res.data.isLogin));
        dispatch(setUser(res.data.user));
        navigate('/login');
      }
    });
  };

  const renderPostBoxes = postBoxes.map((postBox: PostBox) => {
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
          {userData.profile ? (
            <img src={userData.profile} alt="사용자 프로필 사진" />
          ) : (
            <FaUserCircle />
          )}
        </div>

        <div className={styles.userInfo}>
          <h3>{userData.name}</h3>
          <div className={styles.userNumbers}>
            <div className={styles.userPostNum}>
              <h4>게시물</h4>
              <span>2</span>
            </div>
            <div className={styles.userFamilyNum}>
              <h4>가족</h4>
              <span>4</span>
            </div>
          </div>
          <div className={styles.userButtons}>
            <button className={styles.profileEditBtn}>계정 관리</button>
            <button
              className={styles.logoutBtn}
              onClick={() => onLogoutClicked()}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className={styles.userPosts}>{renderPostBoxes}</div>
    </div>
  );
}
