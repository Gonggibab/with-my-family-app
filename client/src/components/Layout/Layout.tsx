import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { RootState } from 'redux/store';
import {
  setCurrentPage,
  setIsLoading,
  updateIsDarkMode,
} from 'redux/_slices/appSlice';
import { UserAPI } from 'api/UserAPI';
import { WebSocketAPI } from 'api/WebSocketAPI';
import { setIsLogin, setUser } from 'redux/_slices/userSlice';
import fetchFamilyData from 'utils/fetchFamilyData';
import { checkCategory } from 'utils/checkCategory';
import fetchFamilyRequest from 'utils/fetchFamilyRequest';
import ToggleSwitch from 'components/Layout/ToggleSwitch';
import Loader from 'components/Loader';
import { AiFillHome } from 'react-icons/ai';
import { FaUserCircle, FaUserFriends } from 'react-icons/fa';
import { BsFillChatFill } from 'react-icons/bs';
import { RiLoginBoxFill } from 'react-icons/ri';

import styles from 'styles/components/Layout/Layout.module.scss';
import logo from 'assets/logo.svg';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user);
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const unreadMsgsCount = useSelector(
    (state: RootState) => state.user.unreadMsgsCount
  );
  const isDarkMode = useSelector((state: RootState) => state.app.isDarkMode);
  const currentPage = useSelector((state: RootState) => state.app.currentPage);
  const isLoading = useSelector((state: RootState) => state.app.isLoading);

  useEffect(() => {
    dispatch(setIsLoading(true));
    const localTheme = localStorage.getItem('color-theme');
    const OStheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const theme = localTheme ? localTheme : OStheme;

    dispatch(updateIsDarkMode(theme === 'dark'));
    localStorage.setItem('color-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    fetchUserData();
    dispatch(setIsLoading(false));
  }, []);

  useEffect(() => {
    if (user && !isLogin) {
      if (!location.pathname.includes('login')) navigate('login');
    }

    dispatch(setCurrentPage(location.pathname));
  }, [location.pathname]);

  const fetchUserData = async () => {
    try {
      const userRes = await UserAPI.auth();
      dispatch(setIsLogin(userRes.data.isLogin));
      if (userRes.data.isLogin) {
        dispatch(setUser(userRes.data.user));
        const families = await fetchFamilyData(userRes.data.user._id, dispatch);
        fetchFamilyRequest(userRes.data.user._id, dispatch);
        WebSocketAPI.initialize(
          userRes.data.user._id,
          userRes.data.user.name,
          families!,
          dispatch
        );
      }
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

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
            to={isLogin ? `/profile/${user._id}` : '/login'}
            className={
              checkCategory(currentPage, `/profile/${user._id}`) ||
              checkCategory(currentPage, '/login')
                ? styles.active
                : ''
            }
          >
            {isLogin ? (
              <FaUserCircle size={24} />
            ) : (
              <RiLoginBoxFill size={25} />
            )}
            <span>{isLogin ? '프로필' : '로그인'}</span>
          </Link>
          <Link
            to="/family"
            className={
              checkCategory(currentPage, '/family') ? styles.active : ''
            }
          >
            <FaUserFriends size={26} />
            <span>가족</span>
          </Link>
          <Link
            to="/chat"
            className={checkCategory(currentPage, '/chat') ? styles.active : ''}
          >
            <BsFillChatFill size={23} />
            <span>채팅</span>
            {unreadMsgsCount !== 0 && (
              <div className={styles.unReadCount}>{unreadMsgsCount}</div>
            )}
          </Link>
        </div>

        <div className={styles.btnDarkmode}>
          <span>{isDarkMode ? '다크모드' : '라이트모드'}</span>
          <ToggleSwitch />
        </div>
      </nav>
      <main>{children}</main>
      {isLoading && <Loader />}
    </>
  );
}
