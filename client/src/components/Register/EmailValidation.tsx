import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import {
  setIsValidatePage,
  setPassCheck,
  setPassword,
  setValidationNum,
} from 'redux/_slices/registerSlice';
import { UserAPI, UserDataType } from 'api/UserAPI';
import { sendEmailVerification } from 'utils/sendEmail';

import styles from 'styles/components/Register/EmailVaildation.module.scss';
import logo from 'assets/createAccount.svg';
import { setIsLoading } from 'redux/_slices/appSlice';

export default function EmailValidation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.register.email);
  const password = useSelector((state: RootState) => state.register.password);
  const name = useSelector((state: RootState) => state.register.name);
  const bDay = useSelector((state: RootState) => state.register.bDay);
  const validationNum = useSelector(
    (state: RootState) => state.register.validationNum
  );
  const [enteredNum, setEnteredNum] = useState<string>('');
  const [expireTimeLeft, setExpireTimeLeft] = useState<number>(300);

  useEffect(() => {
    const timer = setInterval(() => {
      if (expireTimeLeft - 1 < 0) {
        clearInterval(timer);
        dispatch(setValidationNum('expired'));
      } else {
        setExpireTimeLeft(expireTimeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expireTimeLeft]);

  const onReSendClicked = (target: HTMLButtonElement) => {
    const validationNum = sendEmailVerification(name, email);
    if (validationNum !== '') {
      dispatch(setValidationNum(validationNum));
    }

    // Reset Timer
    setExpireTimeLeft(300);

    // Hide button for 1 minute
    target.style.display = 'none';
    const timer = setInterval(() => {
      target.style.display = 'block';
      clearInterval(timer);
    }, 10000);
  };

  const onConfirmClicked = (target: HTMLButtonElement) => {
    const errElem = target.previousElementSibling?.previousElementSibling;

    if (errElem) {
      if (enteredNum === '') {
        errElem.innerHTML = '인증코드를 입력하세요';
      } else if (validationNum === 'expired' || validationNum === '') {
        errElem.innerHTML =
          '인증코드가 만료되었습니다. 인증메일을 재전송 하세요';
      } else if (enteredNum !== validationNum) {
        errElem.innerHTML = '인증코드가 틀렸습니다';
      } else {
        dispatch(setIsLoading(true));
        const birthday = new Date(
          +bDay.substring(0, 4),
          +bDay.substring(5, 7),
          +bDay.substring(8, 10)
        );

        const userData: UserDataType = {
          email: email,
          password: password,
          name: name,
          birthday: birthday,
          role: 0,
        };

        UserAPI.register(userData).then((res) => {
          if (res.status === 400) {
            errElem.innerHTML = '다시 시도해 주세요.';
          } else {
            dispatch(setIsValidatePage(false));
            dispatch(setPassword(''));
            dispatch(setPassCheck(''));
            navigate('/');
          }
        });
        dispatch(setIsLoading(true));
      }

      let errTimer = setTimeout(() => {
        errElem.innerHTML = '';
        clearTimeout(errTimer);
      }, 3000);
    }
  };

  const onCancelClicked = () => {
    dispatch(setIsValidatePage(false));
    dispatch(setPassword(''));
    dispatch(setPassCheck(''));
  };

  return (
    <section className={styles.vaildationBox}>
      <img className={styles.logo} src={logo} alt="계정 만들기" />

      <div className={styles.emailVaildation}>
        <span className={styles.title}>{email} 으로 인증번호를 보냈습니다</span>
        <div className={styles.validation}>
          <div className={styles.input}>
            <input
              type="text"
              placeholder="인증번호 (6자리)"
              onChange={(e) => setEnteredNum(e.currentTarget.value)}
            />
            <span className={styles.timer}>{`${Math.floor(
              expireTimeLeft / 60
            )}:${String(expireTimeLeft % 60).padStart(2, '0')}`}</span>
          </div>
          <button
            className={styles.resend}
            onClick={(e) => onReSendClicked(e.currentTarget)}
          >
            재전송
          </button>
        </div>
        <div className={styles.errMsg}></div>
        <div className={styles.instruction}>
          <span>· 3분 이내로 인증번호 (6자리)를 입력하세요</span>
          <span>
            · 인증번호가 전송되지 않을경우 &ldquo;재전송&rdquo;버튼을 눌러주세요
          </span>
        </div>
        <button
          className={styles.confirm}
          onClick={(e) => onConfirmClicked(e.currentTarget)}
        >
          확인
        </button>
        <a className={styles.cancel} onClick={() => onCancelClicked()}>
          취소
        </a>
      </div>
    </section>
  );
}
