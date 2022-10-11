import { useState } from 'react';

import RegisterBox from 'components/Register/RegisterBox';
import EmailValidation from 'components/Register/EmailValidation';

import styles from 'styles/views/Register.module.scss';

export type RegisterBoxProps = {
  email: string;
  password: string;
  passCheck: string;
  name: string;
  bDay: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setPassCheck: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setBDay: React.Dispatch<React.SetStateAction<string>>;
  setValidationNum: React.Dispatch<React.SetStateAction<string>>;
  setIsValidatePage: React.Dispatch<React.SetStateAction<boolean>>;
};

export type EmailValidationProps = {
  email: string;
  password: string;
  name: string;
  bDay: string;
  validationNum: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setPassCheck: React.Dispatch<React.SetStateAction<string>>;
  setValidationNum: React.Dispatch<React.SetStateAction<string>>;
  setIsValidatePage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passCheck, setPassCheck] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [bDay, setBDay] = useState<string>('');
  const [validationNum, setValidationNum] = useState<string>('');
  const [isValidatePage, setIsValidatePage] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      {!isValidatePage ? (
        <RegisterBox
          email={email}
          password={password}
          passCheck={passCheck}
          name={name}
          bDay={bDay}
          setEmail={setEmail}
          setPassword={setPassword}
          setPassCheck={setPassCheck}
          setName={setName}
          setBDay={setBDay}
          setValidationNum={setValidationNum}
          setIsValidatePage={setIsValidatePage}
        />
      ) : (
        <EmailValidation
          email={email}
          password={password}
          name={name}
          bDay={bDay}
          validationNum={validationNum}
          setPassword={setPassword}
          setPassCheck={setPassCheck}
          setValidationNum={setValidationNum}
          setIsValidatePage={setIsValidatePage}
        />
      )}
    </div>
  );
}
