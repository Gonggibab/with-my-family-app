import styles from 'styles/views/Home.module.scss';

export default function Setting() {
  const onAuthClicked = () => {};
  return (
    <div className={styles.container}>
      <h1>설정 페이지 입니다.</h1>
      <button onClick={() => onAuthClicked()}>인증 테스트</button>
    </div>
  );
}
