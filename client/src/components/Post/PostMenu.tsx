import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import { PostMenuProps } from 'views/post';

import styles from 'styles/components/Post/PostMenu.module.scss';

export default function PostMenu({ postId, setIsMenuOpen }: PostMenuProps) {
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const onDeleteClicked = async () => {
    try {
      await PostAPI.delete(postId);
      await MediaAPI.deleteByPost(postId);
      navigate(-1);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  return (
    <div className={styles.container}>
      {!isConfirm ? (
        <ul className={styles.PostMenu}>
          <li className={styles.delete} onClick={() => setIsConfirm(true)}>
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
            <button className={styles.confirmBtn} onClick={onDeleteClicked}>
              확인
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setIsConfirm(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
