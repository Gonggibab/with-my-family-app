import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import AddPostBox from 'components/AddPost/addPostBox';

import styles from 'styles/views/AddPost.module.scss';

export default function AddPost() {
  const navigate = useNavigate();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);

  useEffect(() => {
    if (!isLogin) {
      navigate('/');
    }
  }, []);

  return (
    <div className={styles.container}>
      <AddPostBox />
    </div>
  );
}
