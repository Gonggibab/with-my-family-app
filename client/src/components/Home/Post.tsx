import { useDispatch } from 'react-redux';
import {
  BsHandThumbsUpFill,
  BsHandThumbsUp,
  BsFillChatFill,
} from 'react-icons/bs';

import { calcDateDiff } from 'utils/calcDateDiff';
import { commentDataType, PostProps } from 'views/home';

import styles from 'styles/components/Home/Post.module.scss';
import profile from 'assets/images/testProfileMe.jpg';
import media from 'assets/images/testImg1.jpg';

export default function Post({
  name,
  relationship,
  profileURL,
  imgURL,
  isDdabong,
  content,
  updatedAt,
  comments,
}: PostProps) {
  const dispatch = useDispatch();

  const onDdabongClicked = () => {};
  const dateDiff = calcDateDiff(updatedAt);

  const singleCommentComponent = () => {
    const { commentId, name, relationship, comment, updatedAt } = comments[0];
    const dateDiff = calcDateDiff(updatedAt);

    return (
      <div key={commentId} className={styles.comment}>
        <span className={styles.commenter}>
          {relationship ? relationship : name}
        </span>
        <p>{comment}</p>
        <span className={styles.commentDate}>{dateDiff}</span>
      </div>
    );
  };

  const commentComponents = comments.map((data: commentDataType) => {
    const { commentId, name, relationship, comment, updatedAt } = data;
    const dateDiff = calcDateDiff(updatedAt);

    return (
      <div key={commentId} className={styles.comment}>
        <span>{relationship ? relationship : name}</span>
        <p>{comment}</p>
        <span>{dateDiff}</span>
      </div>
    );
  });

  return (
    <article className={styles.post}>
      <div className={styles.uploader}>
        <img className={styles.profile} src={profile} alt="img" />
        <span>{relationship ? relationship : name}</span>
      </div>
      <img className={styles.media} src={media} alt="img" />
      <div className={styles.buttons}>
        <button className={styles.ddabong} onClick={() => onDdabongClicked()}>
          {isDdabong ? (
            <BsHandThumbsUpFill color="#3069f5" />
          ) : (
            <BsHandThumbsUp />
          )}
        </button>
        <button className={styles.chat}>
          <BsFillChatFill />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.contentUploader}>
          {relationship ? relationship : name}
        </span>
        <p>{content}</p>
        <span className={styles.contentDate}>{dateDiff}</span>
      </div>
      <div className={styles.comments}>
        {singleCommentComponent()}
        <button>댓글 더 보기</button>
      </div>
      <div className={styles.input}></div>
    </article>
  );
}
