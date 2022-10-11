import { ChangeEvent, useState } from 'react';

import { MediaAPI } from 'api/MediaAPI';
import { UserAPI } from 'api/UserAPI';
import { ChangeProfileProps } from './ProfileManage';
import { convertURL } from 'utils/convertURL';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Profile/ChangeProfile.module.scss';
import DeleteConfirm from 'components/DeleteConfirm';

export default function ChangeProfile({
  profileFile,
  setProfileFile,
  previewURL,
  setPreviewURL,
  isNewProfileAdded,
  setIsNewProfileAdded,
  userData,
  getUserData,
}: ChangeProfileProps) {
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files!;
    setProfileFile(file[0]);
    setPreviewURL(URL.createObjectURL(file[0]));
    setIsNewProfileAdded(true);
  };

  const onProfileConfirmedClicked = async () => {
    try {
      if (userData?.profile) {
        await MediaAPI.deleteMediabyURL([userData.profile]);
        await UserAPI.updateUser({
          userId: userData._id,
          update: {
            profile: '',
          },
        });
      }

      const mediaRes = await MediaAPI.uploadMediaForProfile(
        profileFile!,
        userData._id
      );

      await UserAPI.updateUser({
        userId: userData._id,
        update: {
          profile: mediaRes.data.media[0].filePath,
        },
      });

      setProfileFile(undefined);
      setPreviewURL('');
      getUserData(userData._id);
      setIsNewProfileAdded(false);
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요! ' + err);
    }
  };

  const deleteProfile = async () => {
    try {
      if (userData?.profile) {
        await MediaAPI.deleteMediabyURL([userData.profile]);
        await UserAPI.updateUser({
          userId: userData._id,
          update: {
            profile: '',
          },
        });
        setProfileFile(undefined);
        setPreviewURL('');
        getUserData(userData._id);
        setIsDeleteConfirm(false);
      }
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요! ' + err);
    }
  };

  const onProfileCancelClicked = () => {
    setProfileFile(undefined);
    setPreviewURL('');
    setIsNewProfileAdded(false);
  };

  return (
    <div className={styles.ChangeProfile}>
      <div className={styles.userProfile}>
        {previewURL && <img src={previewURL} alt="사용자 프로필 사진" />}
        {!previewURL && userData?.profile && (
          <img src={convertURL(userData.profile)} alt="사용자 프로필 사진" />
        )}
        {!previewURL && !userData?.profile && <FaUserCircle />}
      </div>
      <div className={styles.profileButtons}>
        {!isNewProfileAdded ? (
          <>
            <div className={styles.fileInput}>
              <label className={styles.imgAddBtn} htmlFor="file">
                프로필 바꾸기
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) => onFileSelected(e)}
              />
            </div>
            {userData?.profile && (
              <button
                className={styles.deleteBtn}
                onClick={() => setIsDeleteConfirm(true)}
              >
                삭제
              </button>
            )}
            {isDeleteConfirm && (
              <DeleteConfirm
                setIsDeleteConfirm={setIsDeleteConfirm}
                onConfirmClicked={deleteProfile}
              />
            )}
          </>
        ) : (
          <>
            <button
              className={styles.changeBtn}
              onClick={onProfileConfirmedClicked}
            >
              프로필 변경 저장
            </button>
            <button
              className={styles.cancelBtn}
              onClick={onProfileCancelClicked}
            >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  );
}
