import { ChangeEvent, useState } from 'react';

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { ImagePreviewProps } from './addPostBox';

import styles from 'styles/components/AddPost/ImagePreview.module.scss';

export default function ImagePreview({
  files,
  setFiles,
  setIsContentAdd,
}: ImagePreviewProps) {
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [isEditActive, setIsEditActive] = useState<boolean>(false);

  const onImgEditClicked = () => {
    setIsEditActive(true);
  };

  const onEditCloseClicked = () => {
    setIsEditActive(false);
  };

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files!;

    const newFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      newFiles.push(file);
    }

    setFiles(files.concat(newFiles));
  };

  const onImgDeleteClicked = (idx: number) => {
    if (idx > 0) setImgIndex(imgIndex - 1);

    const arrFiles = [...files];
    arrFiles.splice(idx, 1);
    setFiles(arrFiles);
  };

  const onBackClicked = () => {
    setFiles([]);
    setImgIndex(0);
  };

  const onNextClicked = () => {
    setIsContentAdd(true);
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
          <div className={styles.imgEditBar}>
            {!isEditActive ? (
              <button className={styles.imgEditBtn} onClick={onImgEditClicked}>
                이미지 편집
              </button>
            ) : (
              <>
                <button
                  className={styles.closeEditBtn}
                  onClick={onEditCloseClicked}
                >
                  닫기
                </button>
                <div className={styles.fileInput}>
                  <label className={styles.imgAddBtn} htmlFor="file">
                    파일 추가
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
                  onClick={() => onImgDeleteClicked(imgIndex)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
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
      <div className={styles.buttons}>
        <button className={styles.backBtn} onClick={onBackClicked}>
          뒤로
        </button>
        <button className={styles.nextBtn} onClick={onNextClicked}>
          다음
        </button>
      </div>
    </div>
  );
}
