import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { MediaAPI } from 'api/MediaAPI';
import { PostAPI } from 'api/PostAPI';
import PostMenu from 'components/Post/PostMenu';
import { calcDateDiff } from 'utils/calcDateDiff';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import {
  BsFillChatFill,
  BsHandThumbsUpFill,
  BsThreeDots,
} from 'react-icons/bs';

import styles from 'styles/views/Post.module.scss';

type PostInfo = {
  uploader: string;
  profile: string;
  content: string;
  updatedAt: string;
};

type Media = {
  url: string;
  type: string;
};

export type PostMenuProps = {
  postId: string;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.user.user);
  const [postInfo, setPostInfo] = useState<PostInfo>({
    uploader: '',
    profile: '',
    content: '',
    updatedAt: '',
  });
  const [index, setIndex] = useState<number>(0);
  const [media, setMedia] = useState<Media[]>([]);
  const [content, setContent] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMyPost, setIsMyPost] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getPostData(id);
    }
  }, []);

  const getPostData = async (id: string) => {
    try {
      const postRes = await PostAPI.getPost(id);
      const post = postRes.data.post;
      setPostInfo({
        uploader: post.userId.name,
        profile: post.userId.profile,
        content: post.content,
        updatedAt: post.updatedAt,
      });

      if (user._id === post.userId._id) {
        setIsMyPost(true);
      }

      const mediaRes = await MediaAPI.getByPost(post._id);
      const mediaList = mediaRes.data.media;
      const tempMedia = [];
      for (const media of mediaList) {
        tempMedia.push({
          url: media.filePath,
          type: media.mimeType,
        });
      }
      setMedia(tempMedia);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const onAddCommentClicked = () => {};

  const mediaComponent = (media: Media[], idx: number) => {
    if (media.length !== 0) {
      const file = media[idx];

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
    <div className={styles.container}>
      {isMenuOpen && <PostMenu postId={id!} setIsMenuOpen={setIsMenuOpen} />}
      <div className={styles.PostBox}>
        {isMyPost && (
          <button
            className={styles.menuBtn}
            onClick={() => setIsMenuOpen(true)}
          >
            <BsThreeDots size={20} />
          </button>
        )}
        <section className={styles.mediaBox}>
          <div className={styles.uploader}>
            {postInfo.profile ? (
              <img src={postInfo.profile} alt="사용자 프로필" />
            ) : (
              <FaUserCircle />
            )}
            <span>{postInfo.uploader}</span>
          </div>
          <div className={styles.media}>
            {mediaComponent(media, index)}
            {index > 0 && (
              <RiArrowLeftSLine
                className={styles.leftArrow}
                onClick={() => setIndex(index - 1)}
              />
            )}
            {index < media.length - 1 && (
              <RiArrowRightSLine
                className={styles.rightArrow}
                onClick={() => setIndex(index + 1)}
              />
            )}
          </div>
        </section>
        <section className={styles.Comments}>
          <div className={styles.commentBox}>
            <div className={styles.comment}>
              <span>{postInfo.uploader}</span>
              <div className={styles.content}>
                <p>{postInfo.content}</p>
                <span>{calcDateDiff(postInfo.updatedAt)}</span>
              </div>
            </div>
            <div className={styles.comment}>
              <span>{postInfo.uploader}</span>
              <div className={styles.content}>
                <p>{postInfo.content}</p>
                <span>{calcDateDiff(postInfo.updatedAt)}</span>
              </div>
            </div>
            <div className={styles.comment}>
              <span>{postInfo.uploader}</span>
              <div className={styles.content}>
                <p>{postInfo.content}</p>
                <span>{calcDateDiff(postInfo.updatedAt)}</span>
              </div>
            </div>
            <div className={styles.comment}>
              <span>{postInfo.uploader}</span>
              <div className={styles.content}>
                <p>{postInfo.content}</p>
                <span>{calcDateDiff(postInfo.updatedAt)}</span>
              </div>
            </div>
          </div>
          <button className={styles.moreCommentBtn}>댓글 더보기</button>
          <div className={styles.buttons}>
            <button className={styles.ddabong}>
              <BsHandThumbsUpFill />
            </button>
            <button className={styles.chat}>
              <BsFillChatFill />
            </button>
          </div>
          <div className={styles.commentInput}>
            <textarea
              placeholder="내용을 입력하세요"
              onChange={(e) => setContent(e.currentTarget.value)}
            />
            <button onClick={onAddCommentClicked}>확인</button>
          </div>
          <button className={styles.closeBtn} onClick={() => navigate(-1)}>
            뒤로
          </button>
        </section>
      </div>
    </div>
  );
}
