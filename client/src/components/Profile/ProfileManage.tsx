import { ChangeEvent, useState } from 'react';

import { ProfileManageProps } from 'views/profile';

import styles from 'styles/components/Profile/ProfileManage.module.scss';
import { FaUserCircle } from 'react-icons/fa';
import { validatebDay } from 'utils/validateInput';
import { MediaAPI } from 'api/MediaAPI';
import { UserAPI } from 'api/UserAPI';
import dateToString from 'utils/dateToString';
import stringToDate from 'utils/stringToDate';

export default function ProfileManage({
  userData,
  setIsManagement,
  getUserData,
}: ProfileManageProps) {
  const [name, setName] = useState<string>(userData.name);
  const [birthday, setBirthday] = useState<string>(
    userData.birthday ? dateToString(userData.birthday) : ''
  );
  const [profileFile, setProfileFile] = useState<File>();
  const [previewURL, setPreviewURL] = useState<string>('');
  const [isNewProfileAdded, setIsNewProfileAdded] = useState<boolean>(false);

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files!;
    setProfileFile(file[0]);
    setPreviewURL(URL.createObjectURL(file[0]));
    setIsNewProfileAdded(true);
  };

  const closeManage = () => {
    setName('');
    setBirthday('');
    setProfileFile(undefined);
    setPreviewURL('');
    setIsManagement(false);
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
      console.log(mediaRes.data.media[0].filePath);

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

  const onProfileDeleteClicked = async () => {
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

  const onConfirmClicked = async () => {
    try {
      console.log(name);
      console.log(stringToDate(birthday));

      // await UserAPI.updateUser({
      //   userId: userData._id,
      //   update: {
      //     name: name,
      //     birthday: stringToDate(birthday),
      //   },
      // });
      // closeManage();
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요! ' + err);
    }
  };

  return (
    <div className={styles.container} onClick={closeManage}>
      <div
        className={styles.profileManageBox}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.changeProfile}>
          <div className={styles.userProfile}>
            {previewURL && <img src={previewURL} alt="사용자 프로필 사진" />}
            {!previewURL && userData?.profile && (
              <img
                src={`http://localhost:5000/${userData.profile}`}
                alt="사용자 프로필 사진"
              />
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
                    onClick={onProfileDeleteClicked}
                  >
                    삭제
                  </button>
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
        <div className={styles.manageBoxGrid}>
          <span>이메일</span>
          <div className={styles.inputBox}>
            <div className={styles.input}>
              <input type="text" defaultValue={userData.email} readOnly />
            </div>
          </div>
          <span>이름</span>
          <div className={styles.inputBox}>
            <div className={styles.input}>
              <input
                type="text"
                defaultValue={userData.name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
              <div className={styles.errMsg}></div>
            </div>
          </div>
          <span>생일</span>
          <div className={styles.inputBox}>
            <div className={styles.input}>
              <input
                type="text"
                defaultValue={
                  userData.birthday ? dateToString(userData.birthday) : ''
                }
                maxLength={10}
                onChange={(e) => setBirthday(e.currentTarget.value)}
                onBlur={(e) => validatebDay(e.currentTarget, birthday)}
              />
            </div>
            <div className={styles.errMsg}></div>
          </div>
        </div>
        <div>
          <button className={styles.changePasswordBtn}>비밀번호 변경</button>
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={closeManage}>
            취소
          </button>
          <button className={styles.confirmBtn} onClick={onConfirmClicked}>
            변경 저장
          </button>
        </div>
      </div>
    </div>
  );
}
