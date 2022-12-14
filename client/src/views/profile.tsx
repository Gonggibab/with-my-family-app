import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import {
  setChatRooms,
  setFamilies,
  setFamilyRequests,
  setIsLogin,
  setUnreadMsgsCount,
  setUser,
} from 'redux/_slices/userSlice';
import { UserAPI } from 'api/UserAPI';
import { PostAPI } from 'api/PostAPI';
import { RelationshipAPI } from 'api/RelationshipAPI';
import { DdabongAPI } from 'api/DdabongAPI';
import { CommentAPI } from 'api/CommentAPI';
import { MediaAPI } from 'api/MediaAPI';
import PostBox from 'components/Profile/PostBox';
import ProfileManage from 'components/Profile/ProfileManage';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/views/Profile.module.scss';
import { convertURL } from 'utils/convertURL';

type PostBoxData = {
  postId: string;
  filePath: string;
  ddabongCount: string;
  commentCount: string;
};

export type UserData = {
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
  postBox: PostBoxData;
};

export type ProfileManageProps = {
  userData: UserData;
  setIsManagement: React.Dispatch<React.SetStateAction<boolean>>;
  getUserData: (userId: string) => void;
};

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const loadCount = useRef<number>(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [userData, setUserData] = useState<UserData>();
  const [postBoxes, setPostBoxes] = useState<PostBoxData[]>([]);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);
  const [isManagement, setIsManagement] = useState<boolean>(false);

  useEffect(() => {
    loadCount.current = 0;
    setPostBoxes([]);
    const observer = new IntersectionObserver((entries) => {
      if (loadCount.current !== -1 && loadCount.current > 0) {
        entries.forEach((entry) => {
          if (id && entry.isIntersecting) {
            getUserPosts(id, 18);
          }
        });
      }
    });
    observer.observe(bottomRef.current!);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (id) {
      getUserData(id);

      if (user._id === id) {
        setIsMyProfile(true);
      }
    }
  }, [user]);

  const getUserData = async (userId: string) => {
    try {
      dispatch(setIsLoading(true));
      const userRes = await UserAPI.getUser(userId);
      const userData = userRes.data.user;
      const postRes = await PostAPI.countUserPost(userData._id);
      const relationRes = await RelationshipAPI.countRelationship(userData._id);

      setUserData({
        ...userData,
        postCount: postRes.data.count,
        relationCount: relationRes.data.count,
      });

      getUserPosts(userData._id, 18);
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log('????????? ??????????????????. ?????? ????????? ?????????. ' + err);
    }
  };

  const getUserPosts = async (userId: string, loadSize: number) => {
    try {
      const postRes = await PostAPI.getPostsByUser({
        userId: userId,
        size: loadSize,
        load: 0,
      });

      const posts = postRes.data.posts;
      if (posts.length === loadSize) {
        loadCount.current += 1;
      } else {
        loadCount.current = -1;
      }

      const postBoxData = [];
      for (const post of posts) {
        const mediaRes = await MediaAPI.getByPost(post._id);
        const ddabongRes = await DdabongAPI.countDdabongbyPostId(post._id);
        const commentRes = await CommentAPI.countCommentbyPostId(post._id);

        postBoxData.push({
          postId: post._id,
          filePath: mediaRes.data.media[0].filePath,
          ddabongCount: ddabongRes.data.count,
          commentCount: commentRes.data.count,
        });
      }
      setPostBoxes(postBoxData);
    } catch (err) {
      console.log('????????? ??????????????????. ?????? ????????? ?????????. ' + err);
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
      dispatch(setChatRooms([]));
      dispatch(setUnreadMsgsCount(0));
      navigate('/login');
    } catch (err) {
      console.log('????????? ??????????????????. ?????? ????????? ????????? ' + err);
    }
  };

  const renderPostBoxes = postBoxes.map((postBox: PostBoxData) => {
    return <PostBox key={postBox.postId} postBox={postBox} />;
  });

  return (
    <div className={styles.container}>
      {isManagement && (
        <ProfileManage
          userData={userData!}
          setIsManagement={setIsManagement}
          getUserData={getUserData}
        />
      )}
      <div className={styles.userProfile}>
        <div className={styles.userImage}>
          {userData?.profile ? (
            <img src={convertURL(userData.profile)} alt="????????? ????????? ??????" />
          ) : (
            <FaUserCircle />
          )}
        </div>

        <div className={styles.userInfo}>
          <h3>{userData?.name}</h3>
          <div className={styles.userNumbers}>
            <h4>?????????</h4>
            <span>{userData?.postCount}</span>
            <h4>??????</h4>
            <span>{userData?.relationCount}</span>
          </div>
          <div className={styles.userButtons}>
            {isMyProfile ? (
              <>
                {' '}
                <button
                  className={styles.profileEditBtn}
                  onClick={() => setIsManagement(true)}
                >
                  ?????? ??????
                </button>
                <button
                  className={styles.logoutBtn}
                  onClick={() => onLogoutClicked()}
                >
                  ????????????
                </button>
              </>
            ) : (
              <button className={styles.logoutBtn} onClick={() => navigate(-1)}>
                ????????? ?????????
              </button>
            )}
          </div>
        </div>
      </div>
      <hr></hr>
      <div className={styles.userPosts}>
        {renderPostBoxes}
        <div className={styles.scrollObserver} ref={bottomRef}></div>
      </div>
    </div>
  );
}
