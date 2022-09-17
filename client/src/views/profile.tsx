import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { UserAPI } from 'api/UserAPI';

import styles from 'styles/views/Home.module.scss';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, []);

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

  return (
    <div className={styles.container}>
      <h1>프로필 페이지 입니다.</h1>
      <button onClick={() => onLogoutClicked()}>로그아웃</button>
    </div>
  );
}
