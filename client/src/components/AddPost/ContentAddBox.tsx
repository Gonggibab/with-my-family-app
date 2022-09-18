import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import { ContentAddBoxProps } from './addPostBox';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import styles from 'styles/components/AddPost/ContentAddBox.module.scss';
import { setIsLoading } from 'redux/_slices/appSlice';

export default function ContentAddBox({
  files,
  setIsContentAdd,
}: ContentAddBoxProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [content, setContent] = useState<string>('');

  const onBackClicked = () => {
    setContent('');
    setIsContentAdd(false);
  };

  const onUploadClicked = async () => {
    dispatch(setIsLoading(true));
    const postData = {
      userId: user._id,
      content: content,
    };

    try {
      const postRes = await PostAPI.upload(postData);
      const postId = postRes.data.postId;

      await MediaAPI.upload(files, postId);
      navigate('/');
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요! ' + err);
    }
    dispatch(setIsLoading(false));
  };

  const imageComponent = (files: File[], idx: number) => {
    if (files.length !== 0) {
      const file = files[idx];
      const blobURL = URL.createObjectURL(file);

      if (file.type.includes('image/')) {
        return <img src={blobURL} alt="이미지" />;
      } else {
        return <video controls autoPlay muted src={blobURL} />;
      }
    }
  };

  return (
    <div className={styles.imageAddBox}>
      <div className={styles.editSection}>
        <div className={styles.imageInspectZone}>
          {imageComponent(files, imgIndex)}
          {imgIndex > 0 && (
            <RiArrowLeftSLine
              className={styles.leftArrow}
              onClick={() => setImgIndex(imgIndex - 1)}
            />
          )}
          {imgIndex < files.length - 1 && (
            <RiArrowRightSLine
              className={styles.rightArrow}
              onClick={() => setImgIndex(imgIndex + 1)}
            />
          )}
        </div>
      </div>
      <div className={styles.contentAddZone}>
        <div className={styles.uploaderInfo}>
          <img src={user.profile} alt="프로필사진" />
          <span>{user.name}</span>
        </div>
        <textarea
          placeholder="내용을 입력하세요"
          onChange={(e) => setContent(e.currentTarget.value)}
        />
      </div>
      <div className={styles.buttons}>
        <button className={styles.backBtn} onClick={onBackClicked}>
          뒤로
        </button>
        <button className={styles.nextBtn} onClick={onUploadClicked}>
          업로드
        </button>
      </div>
    </div>
  );
}
