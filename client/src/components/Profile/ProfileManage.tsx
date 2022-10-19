import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  setFamilies,
  setFamilyRequests,
  setIsLogin,
  setUser,
} from 'redux/_slices/userSlice';
import { UserAPI } from 'api/UserAPI';
import { validateNameNBday, validatePasswords } from 'utils/validateInput';
import dateToString from 'utils/dateToString';
import { ProfileManageProps, UserData } from 'views/profile';
import DeleteConfirm from 'components/DeleteConfirm';
import ChangeProfile from './ChangeProfile';
import ManageBoxGrid from './ManageBoxGrid';

import styles from 'styles/components/Profile/ProfileManage.module.scss';

export type ChangeProfileProps = {
  profileFile: File;
  setProfileFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  previewURL: string;
  setPreviewURL: React.Dispatch<React.SetStateAction<string>>;
  isNewProfileAdded: boolean;
  setIsNewProfileAdded: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData;
  getUserData: (userId: string) => void;
};

export type ManageBoxGridProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  birthday: string;
  setBirthday: React.Dispatch<React.SetStateAction<string>>;
  curPassword: string;
  setCurPassword: React.Dispatch<React.SetStateAction<string>>;
  nextPassword: string;
  setNextPassword: React.Dispatch<React.SetStateAction<string>>;
  checkPassword: string;
  setCheckPassword: React.Dispatch<React.SetStateAction<string>>;
  isChangePassword: boolean;
  userData: UserData;
};

export default function ProfileManage({
  userData,
  setIsManagement,
  getUserData,
}: ProfileManageProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState<string>(userData.name);
  const [birthday, setBirthday] = useState<string>(
    userData.birthday ? dateToString(userData.birthday) : ''
  );
  const [curPassword, setCurPassword] = useState<string>('');
  const [nextPassword, setNextPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [profileFile, setProfileFile] = useState<File>();
  const [previewURL, setPreviewURL] = useState<string>('');
  const [isNewProfileAdded, setIsNewProfileAdded] = useState<boolean>(false);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);

  const closeManage = () => {
    setName('');
    setBirthday('');
    setProfileFile(undefined);
    setPreviewURL('');
    setIsManagement(false);
  };

  const onChangePasswordClicked = () => {
    setCurPassword('');
    setNextPassword('');
    setCheckPassword('');
    setIsChangePassword(!isChangePassword);
  };

  const onConfirmClicked = async () => {
    try {
      if (!isChangePassword) {
        if (validateNameNBday(buttonRef.current!, name, birthday)) {
          await UserAPI.updateUser({
            userId: userData._id,
            update: {
              name: name,
              birthday: new Date(birthday),
            },
          });
          getUserData(userData._id);
          closeManage();
        }
      } else {
        const isValid = await validatePasswords(
          buttonRef.current!,
          curPassword,
          nextPassword,
          checkPassword
        );

        if (isValid) {
          await UserAPI.updatePassword(nextPassword);
          getUserData(userData._id);
          closeManage();
        }
      }
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요! ' + err);
    }
  };

  const deleteAccount = async () => {
    try {
      await UserAPI.deleteUser();
      dispatch(setIsLogin(false));
      dispatch(
        setUser({
          _id: '',
          email: '',
          birthday: '',
          name: '',
          profile: '',
          role: 0,
        })
      );
      dispatch(setFamilies([]));
      dispatch(setFamilyRequests([]));
      navigate('/login');
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
        <ChangeProfile
          profileFile={profileFile!}
          setProfileFile={setProfileFile}
          previewURL={previewURL}
          setPreviewURL={setPreviewURL}
          isNewProfileAdded={isNewProfileAdded}
          setIsNewProfileAdded={setIsNewProfileAdded}
          userData={userData}
          getUserData={getUserData}
        />
        <ManageBoxGrid
          name={name}
          setName={setName}
          birthday={birthday}
          setBirthday={setBirthday}
          curPassword={curPassword}
          setCurPassword={setCurPassword}
          nextPassword={nextPassword}
          setNextPassword={setNextPassword}
          checkPassword={checkPassword}
          setCheckPassword={setCheckPassword}
          isChangePassword={isChangePassword}
          userData={userData}
        />
        <div>
          <button
            className={styles.changePasswordBtn}
            onClick={onChangePasswordClicked}
          >
            {!isChangePassword ? '비밀번호 변경' : '이름/생일 변경'}
          </button>
          <button
            className={styles.deleteAccountBtn}
            onClick={() => setIsDeleteConfirm(true)}
          >
            계정 삭제
          </button>
          {isDeleteConfirm && (
            <DeleteConfirm
              setIsDeleteConfirm={setIsDeleteConfirm}
              onConfirmClicked={deleteAccount}
            />
          )}
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={closeManage}>
            취소
          </button>
          <button
            ref={buttonRef}
            className={styles.confirmBtn}
            onClick={onConfirmClicked}
          >
            변경 저장
          </button>
        </div>
      </div>
    </div>
  );
}
