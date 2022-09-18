import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { setIsLoading } from 'redux/_slices/appSlice';
import { UserAPI } from 'api/UserAPI';
import { SiNaver } from 'react-icons/si';

import styles from 'styles/views/Login.module.scss';

export default function NaverLoginButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    initClient.init();
    getUserProfile();
  }, []);

  const initClient = new window.naver.LoginWithNaverId({
    clientId: process.env.REACT_APP_NAVER_CLIENT_ID!,
    callbackUrl: 'http://localhost:3000/login',
    callbackHandle: true,
    loginButton: { color: 'green', type: 3, height: `30` },
    isPopup: false,
  });

  const getUserProfile = async () => {
    const url = window.location.href;

    if (url.includes('access_token')) {
      dispatch(setIsLoading(true));
      const token = url.split('=')[1].split('&')[0];
      const loginData = {
        token: token,
      };
      const res = await UserAPI.naverLogin(loginData);

      UserAPI.auth().then((res) => {
        if (res.status === 400) {
          console.log('오류가 발생했습니다. 다시 시도해 주세요');
        } else {
          dispatch(setIsLogin(res.data.isLogin));
          dispatch(setUser(res.data.user));
          console.log(res.data.user);
        }
      });

      if (res.status === 200) {
        navigate('/');
      } else {
        navigate('/login');
      }
      dispatch(setIsLoading(false));
    }
  };

  const onLoginClicked = () => {
    const btnNaverLogin = document.getElementById('naverIdLogin')
      ?.firstChild as HTMLAnchorElement;
    btnNaverLogin.click();
  };

  return (
    <button className={styles.loginAPINaver} onClick={onLoginClicked}>
      <SiNaver size={15} />
      <span>Naver로 로그인</span>
      <div id="naverIdLogin" style={{ display: 'none' }} />
    </button>
  );
}
