import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { BsFillChatFill } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri';
import { RiLoginBoxFill } from 'react-icons/ri';

import { RootState } from 'redux/store';
import { setCurrentPage, updateIsDarkMode } from 'redux/_slices/appSlice';
import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import { checkCategory } from 'utils/checkCategory';
import ToggleSwitch from 'components/Layout/ToggleSwitch';

import styles from 'styles/components/Layout/Layout.module.scss';
import logo from 'assets/logo.svg';
import { UserAPI } from 'api/UserAPI';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const isDarkMode = useSelector((state: RootState) => state.app.isDarkMode);
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  useEffect(() => {
    dispatch(setCurrentPage(location.pathname));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    UserAPI.auth().then((res) => {
      if (res.status === 400) {
        console.log('오류가 발생했습니다. 다시 시도해 주세요');
      } else {
        dispatch(setIsLogin(res.data.isLogin));
        dispatch(setUser(res.data.user));
      }
    });

    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    dispatch(updateIsDarkMode(theme === 'dark'));
    document.documentElement.setAttribute('data-theme', theme);
  }, [dispatch]);

  return (
    <>
      <nav className={styles.nav}>
        <img className={styles.logo} src={logo} alt="로고" />

        <div className={styles.icons}>
          <Link to="/" className={currentPage === '/' ? styles.active : ''}>
            <AiFillHome size={25} />
            <span>홈</span>
          </Link>
          <Link
            to={isLogin ? '/profile' : '/login'}
            className={
              checkCategory(currentPage, '/profile') ||
              checkCategory(currentPage, '/login')
                ? styles.active
                : ''
            }
          >
            {isLogin ? (
              <FaUserCircle size={25} />
            ) : (
              <RiLoginBoxFill size={25} />
            )}
            <span>{isLogin ? '프로필' : '로그인'}</span>
          </Link>
          <Link
            to="/chat"
            className={checkCategory(currentPage, '/chat') ? styles.active : ''}
          >
            <BsFillChatFill size={23} />
            <span>채팅</span>
          </Link>
          <Link
            to="/setting"
            className={
              checkCategory(currentPage, '/setting') ? styles.active : ''
            }
          >
            <RiSettings3Fill size={27} />
            <span>설정</span>
          </Link>
        </div>

        <div className={styles.btnDarkmode}>
          <span>{isDarkMode ? '다크모드' : '라이트모드'}</span>
          <ToggleSwitch />
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}