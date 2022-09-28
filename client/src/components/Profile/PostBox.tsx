import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PostBoxProps } from 'views/profile';

import styles from 'styles/components/Profile/PostBox.module.scss';

export default function PostBox({ postId, filePath }: PostBoxProps) {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={styles.PostBox}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate(`/post/${postId}`)}
    >
      <img
        src={`http://localhost:5000/${filePath}`}
        alt="게시물 사진"
        style={isHover ? { filter: `brightness(80%)` } : {}}
      />
      {isHover && <span>게시물 열기</span>}
    </div>
  );
}
