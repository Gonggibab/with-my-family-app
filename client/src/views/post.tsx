import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
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
import { CommentAPI } from 'api/CommentAPI';
import Comment from 'components/Post/Comment';
import { DdabongAPI } from 'api/DdabongAPI';

type PostInfo = {
  uploader: string;
  profile: string;
  content: string;
  updatedAt: string;
};

type MediaData = {
  url: string;
  type: string;
};

type DdabongData = {
  ddabongId: string;
  userId: string;
  name: string;
};

type CommentData = {
  commentId: string;
  userId: string;
  uploader: string;
  content: string;
  updatedAt: string;
};

export type PostMenuProps = {
  postId: string;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CommentProps = {
  comment: CommentData;
  updateCommentData: () => void;
};

export default function Post() {
  const { id } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [postInfo, setPostInfo] = useState<PostInfo>();
  const [index, setIndex] = useState<number>(0);
  const [media, setMedia] = useState<MediaData[]>([]);
  const [ddabongs, setDdabongs] = useState<DdabongData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [content, setContent] = useState<string>('');
  const [isDdabong, setIsDdabong] = useState<boolean>(false);
  const [ddabongId, setDdabongId] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMyPost, setIsMyPost] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getPostData(id);
    }
  }, [user]);

  useEffect(() => {
    checkIsDdabong();
  }, [ddabongs]);

  const getPostData = async (id: string) => {
    try {
      dispatch(setIsLoading(true));
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
      const tempMedia = [];
      for (const media of mediaRes.data.media) {
        tempMedia.push({
          url: media.filePath,
          type: media.mimeType,
        });
      }
      setMedia(tempMedia);

      const ddabongList = [];
      const ddabongRes = await DdabongAPI.getDdabongByPost(post._id);
      for (const ddabong of ddabongRes.data.ddabong) {
        ddabongList.push({
          ddabongId: ddabong._id,
          userId: ddabong.userId._id,
          name: ddabong.userId.name,
        });
      }
      setDdabongs(ddabongList);

      updateCommentData();
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const updateCommentData = async () => {
    try {
      const commentRes = await CommentAPI.getCommentsByPost(id!);
      const commentList = [];
      for (const comment of commentRes.data.comment) {
        commentList.push({
          commentId: comment._id,
          userId: comment.userId._id,
          uploader: comment.userId.name,
          content: comment.content,
          updatedAt: comment.updatedAt,
        });
      }
      setComments(commentList);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const checkIsDdabong = () => {
    for (const ddabong of ddabongs) {
      if (user._id === ddabong.userId) {
        setIsDdabong(true);
        setDdabongId(ddabong.ddabongId);
        return;
      }
    }
    setIsDdabong(false);
  };

  const onDdabongClicked = async () => {
    try {
      if (isDdabong && ddabongId !== '') {
        await DdabongAPI.deleteDdabong(ddabongId);
        setDdabongs(
          ddabongs.filter((ddabong) => ddabong.ddabongId !== ddabongId)
        );
        setIsDdabong(false);
        setDdabongId('');
      } else if (user) {
        const ddabongRes = await DdabongAPI.addDdabong({
          postId: id!,
          userId: user._id,
        });
        setDdabongs([
          ...ddabongs,
          {
            ddabongId: ddabongRes.data.ddabong._id,
            userId: user._id,
            name: user.name,
          },
        ]);
        setIsDdabong(true);
        setDdabongId(ddabongRes.data.ddabong._id);
      }
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const onChatClicked = () => {
    textareaRef.current?.focus();
  };

  const onAddCommentClicked = async () => {
    if (content === '') return;
    try {
      await CommentAPI.addComment({
        postId: id!,
        userId: user._id,
        content: content,
      });

      if (textareaRef.current) {
        textareaRef.current.value = '';
        textareaRef.current.blur();
      }

      updateCommentData();
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const renderMedia = (media: MediaData[], idx: number) => {
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

  const renderComments = comments.map((comment) => {
    return (
      <Comment
        key={comment.commentId}
        comment={comment}
        updateCommentData={updateCommentData}
      />
    );
  });

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
            {postInfo?.profile ? (
              <img src={postInfo?.profile} alt="사용자 프로필" />
            ) : (
              <FaUserCircle />
            )}
            <span>{postInfo?.uploader}</span>
          </div>
          <section className={styles.media}>
            {renderMedia(media, index)}
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
          </section>
        </section>
        <section className={styles.Comments}>
          <section className={styles.commentBox}>
            <div className={styles.Comment}>
              <span className={styles.uploader}>{postInfo?.uploader}</span>
              <div className={styles.content}>
                <p>
                  {postInfo?.content}{' '}
                  <span>{calcDateDiff(postInfo?.updatedAt)}</span>
                </p>
              </div>
            </div>
            {renderComments}
          </section>
          {ddabongs.length !== 0 && (
            <section className={styles.ddabongCount}>
              {ddabongs.length === 1 ? (
                <span>
                  <span className={styles.name}>{ddabongs[0].name}</span>
                  <span> 님이 따봉을 날렸습니다</span>
                </span>
              ) : (
                <span>
                  <span className={styles.name}>{ddabongs[0].name}</span>
                  <span> 외 {ddabongs.length} 명이 따봉을 날렸습니다</span>
                </span>
              )}
            </section>
          )}
          <section className={styles.buttons}>
            <button className={styles.ddabong} onClick={onDdabongClicked}>
              {isDdabong ? (
                <BsHandThumbsUpFill style={{ color: '#3069f5' }} />
              ) : (
                <BsHandThumbsUpFill />
              )}
            </button>
            <button className={styles.chat} onClick={onChatClicked}>
              <BsFillChatFill />
            </button>
          </section>
          <section className={styles.commentInput}>
            <textarea
              ref={textareaRef}
              placeholder="내용을 입력하세요"
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
            />
            <button onClick={onAddCommentClicked}>확인</button>
          </section>
          <button className={styles.closeBtn} onClick={() => navigate(-1)}>
            뒤로
          </button>
        </section>
      </div>
    </div>
  );
}
