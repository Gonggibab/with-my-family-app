import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import { PostMenuProps } from 'views/post';

import styles from 'styles/components/Post/PostMenu.module.scss';

export default function PostMenu({
  postId,
  setIsMenuOpen,
  setIsEditOpen,
  setIdx,
}: PostMenuProps) {
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const onBgClicked = () => {
    setIsMenuOpen(false);
  };

  const onDeleteClicked = () => {
    setIsConfirm(true);
  };

  const onEditClicked = () => {
    setIsMenuOpen(false);
    setIsEditOpen(true);
    setIdx(0);
  };

  const onCancelClicked = async () => {
    setIsConfirm(false);
  };

  const onConfirmClicked = async () => {
    try {
      await PostAPI.delete(postId);
      await MediaAPI.deleteByPost(postId);
      navigate(-1);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  return (
    <div className={styles.container} onClick={onBgClicked}>
      {!isConfirm ? (
        <ul className={styles.PostMenu} onClick={(e) => e.stopPropagation()}>
          <li className={styles.delete} onClick={onDeleteClicked}>
            삭제
          </li>
          <hr />
          <li onClick={onEditClicked}>게시물 수정</li>
          <hr />
          <li onClick={() => navigate(-1)}>게시물 닫기</li>
          <hr />
          <li
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            취소
          </li>
        </ul>
      ) : (
        <div className={styles.confirmMsg} onClick={(e) => e.stopPropagation()}>
          <span>정말로 삭제하시겠습니까?</span>
          <div className={styles.buttons}>
            <button className={styles.confirmBtn} onClick={onConfirmClicked}>
              확인
            </button>
            <button className={styles.cancelBtn} onClick={onCancelClicked}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
