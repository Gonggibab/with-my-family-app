import { useState } from 'react';

import ImageAddBox from './ImageAddBox';

import styles from 'styles/components/AddPost/AddPostBox.module.scss';
import ImagePreview from './ImagePreview';
import ContentAddBox from './ContentAddBox';

export type ImageAddBoxProps = {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export type ImagePreviewProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setIsContentAdd: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ContentAddBoxProps = {
  files: File[];
  setIsContentAdd: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddPostBox() {
  const [files, setFiles] = useState<File[]>([]);
  const [isContentAdd, setIsContentAdd] = useState<boolean>(false);

  return (
    <div className={styles.addPostBox}>
      {files.length === 0 && <ImageAddBox setFiles={setFiles} />}
      {files.length !== 0 && !isContentAdd && (
        <ImagePreview
          files={files}
          setFiles={setFiles}
          setIsContentAdd={setIsContentAdd}
        />
      )}
      {isContentAdd && (
        <ContentAddBox files={files} setIsContentAdd={setIsContentAdd} />
      )}
    </div>
  );
}
