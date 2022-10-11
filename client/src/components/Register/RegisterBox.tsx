import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import Input from 'components/Input';
import { RegisterBoxProps } from 'views/register';
import { sendEmailVerification } from 'utils/sendEmail';
import {
  validateAllInputs,
  validatebDay,
  validateEmail,
  validateName,
  validatePassCheck,
  validatePassword,
} from 'utils/validateInput';

import styles from 'styles/components/Register/RegisterBox.module.scss';
import logo from 'assets/createAccount.svg';

export default function RegisterBox({
  email,
  password,
  passCheck,
  name,
  bDay,
  setEmail,
  setPassword,
  setPassCheck,
  setName,
  setBDay,
  setValidationNum,
  setIsValidatePage,
}: RegisterBoxProps) {
  const onRegisterClicked = (e: MouseEvent<HTMLButtonElement>) => {
    validateAllInputs(
      e.currentTarget,
      email,
      password,
      passCheck,
      name,
      bDay
    ).then((res) => {
      if (res) {
        const validationNum = sendEmailVerification(name, email);

        if (validationNum !== '') {
          setValidationNum(validationNum);
          setIsValidatePage(true);
        }
      }
    });
  };

  const onBackClicked = () => {
    setEmail('');
    setPassword('');
    setPassCheck('');
    setName('');
    setBDay('');
  };

  return (
    <section className={styles.registerBox}>
      <img className={styles.logo} src={logo} alt="계정 만들기" />
      <div className={styles.inputs}>
        <div className={styles.input}>
          <span className={styles.title}>이메일 *</span>
          <Input
            type="text"
            maxLength={320}
            placeholder="example1234@gmail.com"
            value={email}
            setValue={setEmail}
            validateInput={validateEmail}
          />
        </div>
        <div className={styles.input}>
          <span className={styles.title}>비밀번호 *</span>
          <Input
            type="password"
            placeholder="8자 이상, 문자/숫자/기호 사용가능"
            value={password}
            password={password}
            setValue={setPassword}
            validateInput={validatePassword}
          />
        </div>
        <div className={styles.input}>
          <span className={styles.title}>비밀번호 확인 *</span>
          <Input
            type="password"
            placeholder="비밀번호를 한번 더 입력해주세요"
            value={passCheck}
            password={password}
            setValue={setPassCheck}
            validateInput={validatePassCheck}
          />
        </div>
        <div className={styles.input}>
          <span className={styles.title}>이름 *</span>
          <Input
            type="text"
            maxLength={50}
            placeholder="홍길동"
            value={name}
            setValue={setName}
            validateInput={validateName}
          />
        </div>
        <div className={styles.input}>
          <span className={styles.title}>생일</span>
          <Input
            type="text"
            maxLength={10}
            placeholder="yyyy-mm-dd"
            value={bDay}
            setValue={setBDay}
            validateInput={validatebDay}
          />
        </div>
        <button
          className={styles.regisButton}
          onClick={(e) => onRegisterClicked(e)}
        >
          등록하기
        </button>
        <Link
          className={styles.back}
          to="/login"
          onClick={() => onBackClicked()}
        >
          뒤로
        </Link>
      </div>
    </section>
  );
}
