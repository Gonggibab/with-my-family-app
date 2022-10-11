import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { DdabongAPI } from 'api/DdabongAPI';
import MediaViewer from 'components/MediaViewer';
import { calcDateDiff } from 'utils/calcDateDiff';
import { convertURL } from 'utils/convertURL';
import { PostProps } from 'views/home';
import { FaUserCircle } from 'react-icons/fa';
import { BsHandThumbsUpFill, BsFillChatFill } from 'react-icons/bs';

import styles from 'styles/components/Home/Post.module.scss';

export default function Post({ post, posts, setPosts }: PostProps) {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [idx, setIdx] = useState<number>(0);
  const [isDdabong, setIsDdabong] = useState<boolean>(false);
  const [ddabongId, setDdabongId] = useState<string>('');

  useEffect(() => {
    checkIsDdabong();
  }, [user]);

  const onDdabongClicked = async () => {
    try {
      if (isDdabong && ddabongId !== '') {
        await DdabongAPI.deleteDdabong(ddabongId);
        setPosts(
          posts.map((p) =>
            p.postId !== post.postId
              ? p
              : {
                  ...p,
                  ddabongList: p.ddabongList.filter(
                    (d) => d.ddabongId !== ddabongId
                  ),
                }
          )
        );
        setIsDdabong(false);
        setDdabongId('');
      } else if (post && user) {
        const ddabongRes = await DdabongAPI.addDdabong({
          postId: post.postId,
          userId: user._id,
        });
        setPosts(
          posts.map((p) =>
            p.postId !== post.postId
              ? p
              : {
                  ...p,
                  ddabongList: p.ddabongList.concat({
                    ddabongId: ddabongRes.data.ddabong._id,
                    userId: user._id,
                    name: user.name,
                  }),
                }
          )
        );
        setIsDdabong(true);
        setDdabongId(ddabongRes.data.ddabong._id);
      }
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const checkIsDdabong = () => {
    for (const ddabong of post.ddabongList) {
      if (user._id === ddabong.userId) {
        setIsDdabong(true);
        setDdabongId(ddabong.ddabongId);
        return;
      }
    }
    setIsDdabong(false);
  };

  return (
    <article className={styles.post}>
      <div className={styles.uploader}>
        {post.profile ? (
          <img src={convertURL(post.profile)} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <span>{post.relationship || post.name}</span>
      </div>
      <section className={styles.media}>
        <MediaViewer media={post.media} idx={idx} setIdx={setIdx} />
      </section>
      {post.ddabongList.length !== 0 && (
        <section className={styles.ddabongCount}>
          {post.ddabongList.length === 1 ? (
            <span>
              <span className={styles.name}>{post.ddabongList[0].name}</span>
              <span> 님이 따봉을 날렸습니다</span>
            </span>
          ) : (
            <span>
              <span className={styles.name}>{post.ddabongList[0].name}</span>
              <span> 외 {post.ddabongList.length} 명이 따봉을 날렸습니다</span>
            </span>
          )}
        </section>
      )}
      <section className={styles.buttons}>
        <button className={styles.ddabong} onClick={() => onDdabongClicked()}>
          {isDdabong ? (
            <BsHandThumbsUpFill style={{ color: '#3069f5' }} />
          ) : (
            <BsHandThumbsUpFill />
          )}
        </button>
        <button
          className={styles.chat}
          onClick={() => navigate(`/post/${post.postId}`)}
        >
          <BsFillChatFill />
        </button>
      </section>
      <section className={styles.content}>
        <span className={styles.contentUploader}>
          {post.relationship || post.name}
        </span>
        <p>{post.content}</p>
        <span className={styles.contentDate}>
          {calcDateDiff(post.updatedAt)}
        </span>
      </section>
      <button
        className={styles.moreCommentsBtn}
        onClick={() => navigate(`/post/${post.postId}`)}
      >
        게시물 보기
      </button>
    </article>
  );
}
