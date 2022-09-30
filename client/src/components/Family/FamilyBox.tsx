import { useState } from 'react';

import { FamilyBoxProps } from 'views/family';
import { FaUserCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

import styles from 'styles/components/Family/FamilyBox.module.scss';
import FamilyBoxMenu from './FamilyBoxMenu';

export type FamilyBoxMenuProps = {
  relationId: string;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FamilyBox({ family }: FamilyBoxProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className={styles.FamilyBox}>
      <div className={styles.familyProfile}>
        {family.profile ? (
          <img src={family.profile} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <div className={styles.familyInfo}>
          <span className={styles.relationship}>
            {family.relationship ? family.relationship : '관계없음'}
          </span>
          <span className={styles.name}>{family.name}</span>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.profileBtn}>프로필 보기</button>
        <button className={styles.messageBtn}>메세지</button>
      </div>
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
