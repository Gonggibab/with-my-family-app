import { useState } from 'react';

import ImageAddBox from './ImageAddBox';

import styles from 'styles/components/AddPost/AddPostBox.module.scss';

export type ImageAddBoxProps = {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function AddPostBox() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className={styles.addPostBox}>
      <ImageAddBox key={0} setFiles={setFiles} />
    </div>
  );
}
