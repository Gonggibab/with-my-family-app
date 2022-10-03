import { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { calcDateDiff } from 'utils/calcDateDiff';
import { CommentAPI } from 'api/CommentAPI';
import DeleteConfirm from './DeleteConfirm';
import { CommentProps } from 'views/post';

import styles from 'styles/views/Post.module.scss';

export type DeleteConfrimProps = {
  commentId: string;
  setIsDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  updateCommentData: () => void;
};

export default function Comment({ comment, updateCommentData }: CommentProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const [content, setContent] = useState<string>(comment.content);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);

  const onEditClicked = () => {
    setIsEdit(true);
    updateCommentData();
  };

  const onDeleteClicked = () => {
    setIsDeleteConfirm(true);
  };

  const onConfirmClicked = async () => {
    if (content && content !== '') {
      try {
        await CommentAPI.updateComment({
          commentId: comment.commentId,
          content: content,
        });
        updateCommentData();
        setIsEdit(false);
      } catch (err) {
        console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
      }
    }
  };

  return (
    <div className={styles.Comment}>
      {isDeleteConfirm && (
        <DeleteConfirm
          commentId={comment.commentId}
          setIsDeleteConfirm={setIsDeleteConfirm}
          updateCommentData={updateCommentData}
        />
      )}
      <span className={styles.uploader}>
        {comment.relationship !== '' ? comment.relationship : comment.uploader}
      </span>
      <div className={styles.content}>
        {isEdit ? (
          <>
            <input
              type="text"
              defaultValue={comment.content}
              onChange={(e) => setContent(e.currentTarget.value)}
            />
            <button onClick={onConfirmClicked}>확인</button>
            <button onClick={() => setIsEdit(false)}>취소</button>
          </>
        ) : (
          <>
            <p>
              {comment.content}
              <span>{calcDateDiff(comment.updatedAt)}</span>
              {user._id === comment.userId && (
                <>
                  <button onClick={onEditClicked}>수정</button>
                  <button onClick={onDeleteClicked}>삭제</button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
