import { MouseEvent, useEffect, useRef, useState } from 'react';

import { BsEye, BsEyeSlash, BsX } from 'react-icons/bs';

import styles from 'styles/components/Input.module.scss';

type InputProps = {
  type: string;
  maxLength?: number;
  placeholder?: string;
  value: string;
  password?: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  validateInput?: (
    target: HTMLInputElement,
    str: string,
    password?: string
  ) => void;
};

export default function Input({
  type,
  maxLength,
  placeholder,
  value,
  password,
  setValue,
  validateInput,
}: InputProps) {
  const inputBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  const onShowClicked = (e: MouseEvent<HTMLButtonElement>) => {
    const siblingInput = e.currentTarget
      .previousElementSibling as HTMLInputElement;

    if (showPassword) {
      siblingInput.type = 'password';
      setShowPassword(false);
    } else {
      siblingInput.type = 'text';
      setShowPassword(true);
    }
  };

  const onXClicked = (e: MouseEvent<HTMLButtonElement>) => {
    inputRef.current!.value = '';
    inputBoxRef.current!.style.border = 'none';
    errRef.current!.innerHTML = '';
    setValue('');
  };

  return (
    <div className={styles.Input} id="input">
      <div className={styles.inputBox} ref={inputBoxRef}>
        <input
          ref={inputRef}
          type={type}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => {
            if (validateInput) validateInput(e.currentTarget, value, password);
          }}
        />
        {type === 'password' && (
          <button className={styles.show} onClick={(e) => onShowClicked(e)}>
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        )}
        <button className={styles.XBtn} onClick={(e) => onXClicked(e)}>
          <BsX />
        </button>
      </div>
      <div className={styles.errMsg} ref={errRef}></div>
    </div>
  );
}
