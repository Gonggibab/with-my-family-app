import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import { PostMenuProps } from 'views/post';

import styles from 'styles/components/Post/PostMenu.module.scss';

export default function PostMenu({ postId, setIsMenuOpen }: PostMenuProps) {
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const onBgClicked = () => {
    setIsMenuOpen(false);
  };

  const onDeleteClicked = (e: MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    setIsConfirm(true);
  };

  const onCancelClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsConfirm(false);
  };

  const onConfirmClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
        <ul className={styles.PostMenu}>
          <li className={styles.delete} onClick={(e) => onDeleteClicked(e)}>
            삭제
          </li>
          <hr />
          <li className={styles.cancel} onClick={() => setIsMenuOpen(false)}>
            취소
          </li>
        </ul>
      ) : (
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
      )}
    </div>
  );
}
