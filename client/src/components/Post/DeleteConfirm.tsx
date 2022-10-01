import { MouseEvent } from 'react';

import { CommentAPI } from 'api/CommentAPI';
import { DeleteConfrimProps } from './Comment';

import styles from 'styles/components/Post/PostMenu.module.scss';

export default function DeleteConfirm({
  commentId,
  setIsDeleteConfirm,
  updateCommentData,
}: DeleteConfrimProps) {
  const onBgClicked = () => {
    setIsDeleteConfirm(false);
  };

  const onCancelClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDeleteConfirm(false);
  };

  const onConfirmClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await CommentAPI.deleteComment(commentId);
      updateCommentData();
      setIsDeleteConfirm(false);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  return (
    <div className={styles.container} onClick={onBgClicked}>
      <div className={styles.confirmMsg}>
        <span>정말로 삭제하시겠습니까?</span>
        <div className={styles.buttons}>
          <button
            className={styles.confirmBtn}
            onClick={(e) => onConfirmClicked(e)}
          >
            확인
          </button>
          <button
            className={styles.cancelBtn}
            onClick={(e) => onCancelClicked(e)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
