import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { setIsLoading } from 'redux/_slices/appSlice';
import { UserAPI } from 'api/UserAPI';
import { PostAPI } from 'api/PostAPI';

import styles from 'styles/views/Profile.module.scss';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const user = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }

    getUserPosts(user._id);
  }, []);

  const getUserPosts = async (userId: string) => {
    try {
      const postRes = await PostAPI.getByUser(userId);
      console.log(postRes.data);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const onLogoutClicked = () => {
    dispatch(setIsLoading(true));
    UserAPI.logout().then((res) => {
      if (res.status === 400) {
        console.log('오류가 발생했습니다. 다시 시도해 주세요');
      } else {
        dispatch(setIsLogin(res.data.isLogin));
        dispatch(setUser(res.data.user));
        navigate('/login');
      }
    });
    dispatch(setIsLoading(false));
  };

  return (
    <div className={styles.container}>
      <div className={styles.userProfile}>
        <div className={styles.userImage}>
          {user.profile ? (
            <img src={user.profile} alt="사용자 프로필 사진" />
          ) : (
            <FaUserCircle />
          )}
        </div>

        <div className={styles.userInfo}>
          <h3>{user.name}</h3>
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
      <div className={styles.userPosts}></div>
    </div>
  );
}
