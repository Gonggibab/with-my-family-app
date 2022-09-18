import { ChangeEvent, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from 'styles/components/AddPost/ImageAddBox.module.scss';
import { ImageAddBoxProps } from './addPostBox';

export default function ImageAddBox({ setFiles }: ImageAddBoxProps) {
  const navigate = useNavigate();

  const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = [];
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

    setFiles(files);
  };

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files!;

    const files = [];
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      files.push(file);
    }

    setFiles(files);
  };

  const onBackClicked = () => {
    navigate('/');
  };

  return (
    <div className={styles.imageAddBox}>
      <div className={styles.editSection}>
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
      </div>
      <div className={styles.buttons}>
        <button className={styles.backBtn} onClick={onBackClicked}>
          뒤로
        </button>
      </div>
    </div>
  );
}
