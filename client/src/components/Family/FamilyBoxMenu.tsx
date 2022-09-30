import { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { RelationshipAPI } from 'api/RelationshipAPI';
import fetchFamilyData from 'utils/fetchFamilyData';
import { FamilyBoxMenuProps } from './FamilyBox';

import styles from 'styles/components/Family/FamilyBoxMenu.module.scss';

export default function FamilyBoxMenu({
  relationId,
  setIsMenuOpen,
}: FamilyBoxMenuProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
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
      await RelationshipAPI.deleteRelationship(relationId);
      fetchFamilyData(user._id, dispatch);
      setIsMenuOpen(false);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  return (
    <div className={styles.container} onClick={onBgClicked}>
      {!isConfirm ? (
        <ul className={styles.FamilyBoxMenu}>
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
