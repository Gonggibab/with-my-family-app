import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import { PostEditProps } from 'views/post';
import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Post/PostEdit.module.scss';

type MediaData = {
  url: string;
  type: string;
  filename?: string;
};

export default function PostEdit({
  media,
  postId,
  postContent,
  setIsEditOpen,
  setIsMenuOpen,
}: PostEditProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [mediaList, setMediaList] = useState<MediaData[]>(media);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [toDeleteFiles, setToDeleteFiles] = useState<string[]>([]);
  const [idx, setIdx] = useState<number>(0);
  const [content, setContent] = useState<string>(postContent);
  const [isEditActive, setIsEditActive] = useState<boolean>(false);

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files!;

    const newFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      newFiles.push(file);
    }
    setNewFiles(newFiles);

    const newMedia: MediaData[] = [];
    for (const file of newFiles) {
      newMedia.push({
        url: URL.createObjectURL(file),
        type: file.type,
        filename: file.name,
      });
    }

    setMediaList(mediaList.concat(newMedia));
  };

  const onImgDeleteClicked = async () => {
    try {
      if (mediaList[idx].filename) {
        for (const file of newFiles) {
          if (file.name === mediaList[idx].filename) {
            if (idx > 0) setIdx(idx - 1);
            const arrFiles = [...mediaList];
            arrFiles.splice(idx, 1);
            setMediaList(arrFiles);
            setNewFiles(newFiles.filter((f) => f.name !== file.name));
          }
        }
      } else {
        if (idx > 0) setIdx(idx - 1);
        const arrFiles = [...mediaList];
        arrFiles.splice(idx, 1);
        setMediaList(arrFiles);
        setToDeleteFiles(toDeleteFiles.concat(mediaList[idx].url));
      }
    } catch (err) {
      console.log('????????? ??????????????????. ?????? ????????? ?????????! ' + err);
    }
  };

  const closeEdit = () => {
    setMediaList(media);
    setIdx(0);
    setContent(postContent);
    setIsEditOpen(false);
    setIsMenuOpen(true);
  };

  const onConfirmClicked = async () => {
    try {
      dispatch(setIsLoading(true));
      if (newFiles) {
        await MediaAPI.uploadMedia(newFiles, postId);
      }
      if (toDeleteFiles) {
        await MediaAPI.deleteMediabyURL(toDeleteFiles);
      }
      if (content !== postContent) {
        await PostAPI.updatePost({
          postId: postId,
          content: content,
        });
      }
      setMediaList(media);
      setIdx(0);
      setContent(postContent);
      setIsEditOpen(false);
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log('????????? ??????????????????. ?????? ????????? ?????????! ' + err);
    }
  };

  const renderMedia = (media: MediaData[]) => {
    if (media.length !== 0) {
      const file = media[idx];

      if (file.type.includes('image/')) {
        return <img src={file.url} alt="?????????" />;
      } else {
        return <video controls autoPlay muted src={file.url} />;
      }
    }
  };

  return (
    <div className={styles.container} onClick={closeEdit}>
      <div className={styles.editPostBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editSection}>
          <div className={styles.imageInspectZone}>
            {renderMedia(mediaList)}
            {idx > 0 && (
              <RiArrowLeftSLine
                className={styles.leftArrow}
                onClick={() => setIdx(idx - 1)}
              />
            )}
            {idx < mediaList.length - 1 && (
              <RiArrowRightSLine
                className={styles.rightArrow}
                onClick={() => setIdx(idx + 1)}
              />
            )}
            <div className={styles.imgEditBar}>
              {!isEditActive ? (
                <button
                  className={styles.imgEditBtn}
                  onClick={() => setIsEditActive(true)}
                >
                  ????????? ??????
                </button>
              ) : (
                <>
                  <button
                    className={styles.closeEditBtn}
                    onClick={() => setIsEditActive(false)}
                  >
                    ??????
                  </button>
                  <div className={styles.fileInput}>
                    <label className={styles.imgAddBtn} htmlFor="file">
                      ?????? ??????
                    </label>
                    <input
                      type="file"
                      id="file"
                      accept="image/*, video/*"
                      multiple
                      onChange={(e) => onFileSelected(e)}
                    />
                  </div>
                  <button
                    className={styles.imgDeleteBtn}
                    onClick={onImgDeleteClicked}
                  >
                    ??????
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.contentZone}>
          <div className={styles.uploaderInfo}>
            {user.profile ? (
              <img src={user.profile} alt="????????? ?????????" />
            ) : (
              <FaUserCircle />
            )}
            <span>{user.name}</span>
          </div>
          <textarea
            placeholder="????????? ???????????????"
            onChange={(e) => setContent(e.currentTarget.value)}
            defaultValue={postContent}
          />
        </div>
        <div className={styles.buttons}>
          <button className={styles.backBtn} onClick={closeEdit}>
            ??????
          </button>
          <button className={styles.nextBtn} onClick={onConfirmClicked}>
            ??????
          </button>
        </div>
      </div>
    </div>
  );
}
