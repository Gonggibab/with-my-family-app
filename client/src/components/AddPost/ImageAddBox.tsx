import { ChangeEvent, DragEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import styles from 'styles/components/AddPost/ImageAddBox.module.scss';
import { ImageAddBoxProps } from './addPostBox';

export default function ImageAddBox({ setFiles }: ImageAddBoxProps) {
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [preview, setPreview] = useState<any[]>([]);

  const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = [];
    const media = [];
    if (e.dataTransfer.items) {
      for (let index = 0; index < e.dataTransfer.items.length; index++) {
        const item = e.dataTransfer.items[index];

        if (item.kind === 'file') {
          const file = item.getAsFile()!;

          if (file.type.includes('image/') || file.type.includes('video/')) {
            files.push(file);
          }
        }
      }
    } else {
      for (let index = 0; index < e.dataTransfer.files.length; index++) {
        const file = e.dataTransfer.files[index];

        if (file.type.includes('image/') || file.type.includes('video/')) {
          files.push(file);
        }
      }
    }

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const blobURL = URL.createObjectURL(file);
      let type = '';
      if (file.type.includes('image/')) {
        type = 'image';
      } else {
        type = 'video';
      }
      media.push({
        type: type,
        url: blobURL,
      });
    }

    setPreview(media);
    setFiles(files);
  };

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files!;

    const files = [];
    const media = [];
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      files.push(file);

      const blobURL = URL.createObjectURL(file);
      let type = '';
      if (file.type.includes('image/')) {
        type = 'image';
      } else {
        type = 'video';
      }
      media.push({
        type: type,
        url: blobURL,
      });
    }

    setPreview(media);
    setFiles(files);
  };

  const onBackClicked = () => {
    if (preview.length === 0) {
      navigate(-1);
    } else {
      setPreview([]);
      setFiles([]);
      setImgIndex(0);
    }
  };

  const onNextClicked = () => {};

  const imageComponent = (idx: number) => {
    if (preview.length !== 0) {
      if (preview[idx].type === 'image') {
        return <img src={preview[idx].url} alt="이미지" />;
      } else {
        return <video controls autoPlay muted src={preview[idx].url} />;
      }
    }
  };

  return (
    <div className={styles.imageAddBox}>
      <div className={styles.editSection}>
        {preview.length === 0 ? (
          <div
            className={styles.imageDropZone}
            onDrop={(e) => onDropHandler(e)}
            onDragOver={(e) => onDragOverHandler(e)}
          >
            <span>사진과 동영상을 여기에 끌어다 놓으세요</span>
            <div className={styles.fileInput}>
              <label htmlFor="file">파일 추가</label>
              <input
                type="file"
                id="file"
                accept="image/*, video/*"
                multiple
                onChange={(e) => onFileSelected(e)}
              />
            </div>
          </div>
        ) : (
          <div className={styles.imageInspectZone}>
            {imageComponent(imgIndex)}
            {imgIndex > 0 && (
              <RiArrowLeftSLine
                className={styles.leftArrow}
                onClick={() => setImgIndex(imgIndex - 1)}
              />
            )}
            {imgIndex < preview.length - 1 && (
              <RiArrowRightSLine
                className={styles.rightArrow}
                onClick={() => setImgIndex(imgIndex + 1)}
              />
            )}
          </div>
        )}
      </div>
      <div className={styles.buttons}>
        <button className={styles.backBtn} onClick={onBackClicked}>
          뒤로
        </button>
        {preview.length !== 0 && (
          <button className={styles.nextBtn} onClick={onNextClicked}>
            다음
          </button>
        )}
      </div>
    </div>
  );
}
