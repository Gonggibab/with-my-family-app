import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import RegisterBox from 'components/Register/RegisterBox';
import EmailValidation from 'components/Register/EmailValidation';

import styles from 'styles/views/Register.module.scss';

export default function Register() {
  const isValidatePage = useSelector(
    (state: RootState) => state.register.isValidatePage
  );

  return (
    <div className={styles.container}>
      {!isValidatePage ? <RegisterBox /> : <EmailValidation />}
    </div>
  );
}
