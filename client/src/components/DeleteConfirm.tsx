import styles from 'styles/components/DeleteConfirm.module.scss';

export type DeleteConfrimProps = {
  setIsDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmClicked: () => Promise<void>;
};

export default function DeleteConfirm({
  setIsDeleteConfirm,
  onConfirmClicked,
}: DeleteConfrimProps) {
  const onBgClicked = () => {
    setIsDeleteConfirm(false);
  };

  const onCancelClicked = () => {
    setIsDeleteConfirm(false);
  };

  return (
    <div className={styles.container} onClick={onBgClicked}>
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
    </div>
  );
}
