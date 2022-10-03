import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PostBoxProps } from 'views/profile';
import { BsFillChatFill, BsHandThumbsUpFill } from 'react-icons/bs';

import styles from 'styles/components/Profile/PostBox.module.scss';

export default function PostBox({ postBox }: PostBoxProps) {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={styles.PostBox}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate(`/post/${postBox.postId}`)}
    >
      <img
        src={`http://localhost:5000/${postBox.filePath}`}
        alt="게시물 사진"
        style={isHover ? { filter: `brightness(80%)` } : {}}
      />
      {isHover && (
        <div className={styles.postInfo}>
          <BsHandThumbsUpFill />
          <span className={styles.ddabong}>{postBox.ddabongCount}</span>
          <BsFillChatFill />
          <span>{postBox.commentCount}</span>
        </div>
      )}
    </div>
  );
}
