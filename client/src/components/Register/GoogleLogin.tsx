import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { AiFillGoogleSquare } from 'react-icons/ai';

import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { UserAPI } from 'api/UserAPI';

import styles from 'styles/views/Login.module.scss';

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const initClient = () => {
      gapi.auth2.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: '',
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const onSuccess = async (res: any) => {
    const userData = {
      email: res.profileObj.email,
      name: res.profileObj.name,
      profile: res.profileObj.imageUrl,
      role: 0,
    };

    const response = await UserAPI.googleLogin(userData);

    UserAPI.auth().then((res) => {
      if (res.status === 400) {
        console.log('오류가 발생했습니다. 다시 시도해 주세요');
      } else {
        dispatch(setIsLogin(res.data.isLogin));
        dispatch(setUser(res.data.user));
      }
    });

    if (response.status === 200) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const onFailure = (err: any) => {
    console.log('Fail');
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
      render={(renderProps) => (
        <button
          className={styles.loginAPIGoogle}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <AiFillGoogleSquare size={19} />
          <span>Google로 로그인</span>
        </button>
      )}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
}
