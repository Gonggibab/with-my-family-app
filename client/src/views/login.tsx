import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { UserAPI } from 'api/UserAPI';
import GoogleLoginButton from 'components/Login/GoogleLogin';
import NaverLoginButton from 'components/Login/NaverLogin';

import styles from 'styles/views/Login.module.scss';
import logo from 'assets/logo_kr.svg';

declare global {
  interface Window {
    naver: any;
  }
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRemainLogin, setIsRemainLogin] = useState<boolean>(false);
  const isLogin = useSelector((state: RootState) => state.user.isLogin);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const testRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }

    setEmail(emailRef.current!.value);
    setPassword(passwordRef.current!.value);
  }, [isLogin, navigate]);

  const onPasswordShow = () => {
    setShowPassword(!showPassword);
    if (!showPassword) {
      passwordRef.current!.type = 'text';
    } else {
      passwordRef.current!.type = 'password';
    }
  };

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
        <input
          ref={emailRef}
          type="text"
          placeholder="이메일을 입력하세요"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.passwordInput}>
          <input
            ref={passwordRef}
            type="password"
            placeholder="비밀번호를 입력하세요"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => onPasswordShow()}>
            {showPassword ? <BsEyeSlash size={15} /> : <BsEye size={15} />}
          </button>
        </div>
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
        <div ref={testRef} className={styles.testDiv}></div>
      </section>
    </div>
  );
}
