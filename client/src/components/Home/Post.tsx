import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { calcDateDiff } from 'utils/calcDateDiff';
import { PostProps } from 'views/home';
import { FaUserCircle } from 'react-icons/fa';
import { BsHandThumbsUpFill, BsFillChatFill } from 'react-icons/bs';

import styles from 'styles/components/Home/Post.module.scss';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

export default function Post({ post }: PostProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [index, setIndex] = useState<number>(0);

  const onDdabongClicked = () => {};
  const dateDiff = calcDateDiff(post.updatedAt);

  const mediaComponent = (idx: number) => {
    if (post.media.length !== 0) {
      const file = post.media[idx];

      if (file.type.includes('image/')) {
        return <img src={`http://localhost:5000/${file.url}`} alt="이미지" />;
      } else {
        return (
          <video
            controls
            autoPlay
            muted
            src={`http://localhost:5000/${file.url}`}
          />
        );
      }
    }
  };

  return (
    <article className={styles.post}>
      <div className={styles.uploader}>
        {post.profile ? (
          <img src={post.profile} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <span>{post.relationship || post.name}</span>
      </div>
      <section className={styles.media}>
        {mediaComponent(index)}
        {index > 0 && (
          <RiArrowLeftSLine
            className={styles.leftArrow}
            onClick={() => setIndex(index - 1)}
          />
        )}
        {index < post.media.length - 1 && (
          <RiArrowRightSLine
            className={styles.rightArrow}
            onClick={() => setIndex(index + 1)}
          />
        )}
      </section>
      <div className={styles.buttons}>
        <button className={styles.ddabong} onClick={() => onDdabongClicked()}>
          <BsHandThumbsUpFill />
        </button>
        <button className={styles.chat}>
          <BsFillChatFill />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.contentUploader}>
          {post.relationship || post.name}
        </span>
        <p>{post.content}</p>
        <span className={styles.contentDate}>{dateDiff}</span>
      </div>
      <button
        className={styles.moreCommentsBtn}
        onClick={() => navigate(`/post/${post.postId}`)}
      >
        댓글 보기
      </button>
    </article>
  );
}
