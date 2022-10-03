import { useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import styles from 'styles/components/MediaViewer.module.scss';

type MediaViewerProps = {
  media: MediaData[];
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
};

export type MediaData = {
  url: string;
  type: string;
};

const MediaViewer = ({ media, idx, setIdx }: MediaViewerProps) => {
  const renderMedia = (idx: number) => {
    if (media.length !== 0) {
      const file = media[idx];

      if (file.type.includes('image/')) {
        return <img src={file.url} alt="이미지" />;
      } else {
        return <video controls autoPlay muted src={file.url} />;
      }
    }
  };

  return (
    <div className={styles.MediaViewer}>
      {renderMedia(idx)}
      {idx > 0 && (
        <RiArrowLeftSLine
          className={styles.leftArrow}
          onClick={() => setIdx(idx - 1)}
        />
      )}
      {idx < media.length - 1 && (
        <RiArrowRightSLine
          className={styles.rightArrow}
          onClick={() => setIdx(idx + 1)}
        />
      )}
    </div>
  );
};
export default MediaViewer;
