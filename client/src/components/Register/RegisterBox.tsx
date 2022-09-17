import { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';

import { RootState } from 'redux/store';
import {
  setBDay,
  setEmail,
  setIsValidatePage,
  setName,
  setPassCheck,
  setPassword,
  setValidationNum,
} from 'redux/_slices/registerSlice';
import RegisterInput from 'components/Register/RegisterInput';
import RegisterPasswordInput from 'components/Register/RegisterPasswordInput';
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

export type RegisterInputProps = {
  title: string;
  inputType: string;
  inputMaxLength?: number;
  inputPlaceholder: string;
  inputValue: string;
  setValue: (value: string) => PayloadAction<string>;
  validateInput: (target: HTMLInputElement, str: string) => void;
};

export type RegisterPasswordInputProps = {
  title: string;
  inputType: string;
  inputMaxLength?: number;
  inputPlaceholder: string;
  inputValue: string;
  password: string;
  setValue: (value: string) => PayloadAction<string>;
  validateInput: (
    target: HTMLInputElement,
    str: string,
    password: string
  ) => void;
};

export default function RegisterBox() {
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.register.email);
  const password = useSelector((state: RootState) => state.register.password);
  const passCheck = useSelector((state: RootState) => state.register.passCheck);
  const name = useSelector((state: RootState) => state.register.name);
  const bDay = useSelector((state: RootState) => state.register.bDay);

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
          dispatch(setValidationNum(validationNum));
          dispatch(setIsValidatePage(true));
        }
      }
    });
  };

  const onBackClicked = () => {
    dispatch(setEmail(''));
    dispatch(setPassword(''));
    dispatch(setPassCheck(''));
    dispatch(setName(''));
    dispatch(setBDay(''));
  };

  return (
    <section className={styles.registerBox}>
      <img className={styles.logo} src={logo} alt="계정 만들기" />
      <div className={styles.inputs}>
        <RegisterInput
          title="이메일 *"
          inputType="text"
          inputMaxLength={320}
          inputPlaceholder="example1234@gmail.com"
          inputValue={email}
          setValue={setEmail}
          validateInput={validateEmail}
        />
        <RegisterPasswordInput
          title="비밀번호 *"
          inputType="password"
          inputPlaceholder="8자 이상, 문자/숫자/기호 사용가능"
          inputValue={password}
          password={password}
          setValue={setPassword}
          validateInput={validatePassword}
        />
        <RegisterPasswordInput
          title="비밀번호 확인 *"
          inputType="password"
          inputPlaceholder="비밀번호를 한번 더 입력해주세요"
          inputValue={passCheck}
          password={password}
          setValue={setPassCheck}
          validateInput={validatePassCheck}
        />
        <RegisterInput
          title="이름 *"
          inputType="text"
          inputMaxLength={50}
          inputPlaceholder="홍길동"
          inputValue={name}
          setValue={setName}
          validateInput={validateName}
        />
        <RegisterInput
          title="생일"
          inputType="text"
          inputMaxLength={10}
          inputPlaceholder="yyyy-mm-dd"
          inputValue={bDay}
          setValue={setBDay}
          validateInput={validatebDay}
        />
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
