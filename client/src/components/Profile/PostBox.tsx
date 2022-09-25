import { useState } from 'react';

import { PostBoxProps } from 'views/profile';

import styles from 'styles/components/Profile/PostBox.module.scss';

export default function PostBox({ filePath }: PostBoxProps) {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={styles.PostBox}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img src={`http://localhost:5000/${filePath}`} alt="게시물 사진" />
      {isHover && <span>게시물 열기</span>}
    </div>
  );
}