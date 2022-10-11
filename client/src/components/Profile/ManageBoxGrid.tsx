import {
  validatebDay,
  validateCurPassword,
  validateName,
  validatePassCheck,
  validatePassword,
} from 'utils/validateInput';
import { ManageBoxGridProps } from './ProfileManage';
import Input from 'components/Input';

import styles from 'styles/components/Profile/ManageBoxGrid.module.scss';

export default function ManageBoxGrid({
  name,
  setName,
  birthday,
  setBirthday,
  curPassword,
  setCurPassword,
  nextPassword,
  setNextPassword,
  checkPassword,
  setCheckPassword,
  isChangePassword,
  userData,
}: ManageBoxGridProps) {
  return (
    <div className={styles.ManageBoxGrid}>
      {!isChangePassword ? (
        <>
          <span>이메일</span>
          <div className={styles.inputBox} key={'email'}>
            <div className={styles.input}>
              <input type="text" defaultValue={userData.email} readOnly />
            </div>
          </div>
          <span>이름</span>
          <div className={styles.inputBox} key={'name'}>
            <Input
              type="text"
              value={name}
              setValue={setName}
              validateInput={validateName}
            />
          </div>
          <span>생일</span>
          <div className={styles.inputBox} key={'bday'}>
            <Input
              type="text"
              maxLength={10}
              value={birthday}
              setValue={setBirthday}
              validateInput={validatebDay}
            />
          </div>
        </>
      ) : (
        <>
          <span>
            현재
            <br />
            비밀번호
          </span>
          <div className={styles.inputBox} key={'curPass'}>
            <Input
              type="password"
              placeholder="현재 비밀번호를 입력해주세요"
              value={curPassword}
              setValue={setCurPassword}
              validateInput={validateCurPassword}
            />
          </div>
          <span>
            바꿀
            <br />
            비밀번호
          </span>
          <div className={styles.inputBox} key={'nextPass'}>
            <Input
              type="password"
              placeholder="8자 이상, 문자/숫자/기호 사용가능"
              value={nextPassword}
              setValue={setNextPassword}
              password={curPassword}
              validateInput={validatePassword}
            />
          </div>
          <span>
            비밀번호
            <br />
            확인
          </span>
          <div className={styles.inputBox} key={'passCheck'}>
            <Input
              type="password"
              placeholder="비밀번호를 한번 더 입력해주세요"
              value={checkPassword}
              setValue={setCheckPassword}
              password={nextPassword}
              validateInput={validatePassCheck}
            />
          </div>
        </>
      )}
    </div>
  );
}
