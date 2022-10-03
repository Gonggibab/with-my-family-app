import { useState } from 'react';

import { RelationshipAPI } from 'api/RelationshipAPI';
import { FamilyBoxProps } from 'views/family';
import { FaUserCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';

import styles from 'styles/components/Family/FamilyBox.module.scss';
import FamilyBoxMenu from './FamilyBoxMenu';
import { useDispatch, useSelector } from 'react-redux';
import fetchFamilyData from 'utils/fetchFamilyData';
import { RootState } from 'redux/store';
import { useNavigate } from 'react-router-dom';

export type FamilyBoxMenuProps = {
  relationId: string;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FamilyBox({ family }: FamilyBoxProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [relationName, setRelationName] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const onConfirmClicked = async () => {
    try {
      await RelationshipAPI.updateRelationship({
        relationId: family.relationId,
        relationship: relationName,
      });
      fetchFamilyData(user._id, dispatch);
      setRelationName('');
      setIsEditMode(false);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  return (
    <div className={styles.FamilyBox}>
      <section className={styles.familyProfile}>
        {family.profile ? (
          <img src={family.profile} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <div className={styles.familyInfo}>
          <div className={styles.relationship}>
            {isEditMode ? (
              <>
                <input
                  type="text"
                  maxLength={4}
                  defaultValue={family.relationship ? family.relationship : ''}
                  onChange={(e) => setRelationName(e.currentTarget.value)}
                />
                <button
                  className={styles.confirmBtn}
                  onClick={onConfirmClicked}
                >
                  확인
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setRelationName(
                      family.relationship ? family.relationship : ''
                    );
                    setIsEditMode(false);
                  }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                {family.relationship ? family.relationship : '관계없음'}
                <AiFillEdit onClick={() => setIsEditMode(true)} />
              </>
            )}
          </div>
          <span className={styles.name}>{family.name}</span>
        </div>
      </section>
      <section className={styles.buttons}>
        <button
          className={styles.profileBtn}
          onClick={() => navigate(`/profile/${family.userId}`)}
        >
          프로필 보기
        </button>
        <button className={styles.messageBtn}>메세지</button>
      </section>
      <button className={styles.menuBtn} onClick={() => setIsMenuOpen(true)}>
        <BsThreeDots size={20} />
      </button>
      {isMenuOpen && (
        <FamilyBoxMenu
          relationId={family.relationId}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}
    </div>
  );
}
