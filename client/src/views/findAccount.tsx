import { useNavigate } from 'react-router-dom';

import styles from 'styles/views/Home.module.scss';

export default function FindAccount() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>계정 찾기 페이지입니다.</h1>
      <h3>페이지 준비중입니다...</h3>
      <a style={{ textDecoration: 'underline' }} onClick={() => navigate(-1)}>
        뒤로가기
      </a>
    </div>
  );
}
