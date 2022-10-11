import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { UserAPI } from 'api/UserAPI';
import GoogleLoginButton from 'components/Login/GoogleLogin';
import NaverLoginButton from 'components/Login/NaverLogin';

import styles from 'styles/views/Login.module.scss';
import logo from 'assets/logo_kr.svg';
import Input from 'components/Input';

declare global {
  interface Window {
    naver: any;
  }
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRemainLogin, setIsRemainLogin] = useState<boolean>(false);
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const onLoginClicked = (target: HTMLButtonElement) => {
    const errElem = target.previousElementSibling as HTMLElement;

    const loginData = {
      email: email,
      password: password,
      isRemainLogin: isRemainLogin,
    };

    UserAPI.login(loginData).then((res) => {
      if (res.status === 400) {
        errElem.innerHTML = '오류가 발생했습니다. 다시 시도해 주세요';
      } else {
        if (!res.data.isLogin) {
          errElem.innerHTML = res.data.message;
        } else {
          dispatch(setIsLogin(res.data.isLogin));
          dispatch(setUser(res.data.user));
          navigate('/');
        }
      }
    });

    let timer = setTimeout(() => {
      errElem.innerHTML = '';
      clearTimeout(timer);
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <section className={styles.loginBox}>
        <img className={styles.logo} src={logo} alt="로고" />
        <Input
          type="text"
          placeholder="이메일을 입력하세요"
          value={email}
          setValue={setEmail}
        />
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          setValue={setPassword}
        />
        <div className={styles.loginCheckbox}>
          <input
            type="checkbox"
            checked={isRemainLogin}
            onChange={() => setIsRemainLogin(!isRemainLogin)}
          ></input>
          <span>로그인 상태 유지하기</span>
        </div>
        <span className={styles.errMsg}></span>
        <button
          className={styles.loginButton}
          onClick={(e) => onLoginClicked(e.currentTarget)}
        >
          로그인
        </button>
        <hr></hr>
        <NaverLoginButton />
        <GoogleLoginButton />
        <Link className={styles.findAccount} to="/login/findAccount">
          비밀번호를 잊으셨나요?
        </Link>
        <Link className={styles.creatAccount} to="/login/register">
          계정 만들기
        </Link>
      </section>
    </div>
  );
}
