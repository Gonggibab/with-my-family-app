import { useState, MouseEvent, useRef, useEffect } from "react";
import { BsX, BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch } from "react-redux";

import { RegisterPasswordInputProps } from "./RegisterBox";

import styles from "../../styles/components/Register/RegisterInput.module.scss";

export default function RegisterPasswordInput({
  title,
  inputType,
  inputMaxLength,
  inputPlaceholder,
  inputValue,
  password,
  setValue,
  validateInput,
}: RegisterPasswordInputProps) {
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = inputValue;
    }
  }, [inputValue]);

  const onXClicked = (e: MouseEvent<HTMLButtonElement>) => {
    const siblingInput = e.currentTarget.previousElementSibling
      ?.previousElementSibling as HTMLInputElement;
    const inputElement = e.currentTarget.parentElement as HTMLInputElement;
    const errorElement = e.currentTarget.parentElement
      ?.nextElementSibling as HTMLElement;

    siblingInput.value = "";
    inputElement.style.border = "none";
    errorElement.innerHTML = "";
    dispatch(setValue(""));
  };

  const onShowClicked = (e: MouseEvent<HTMLButtonElement>) => {
    const siblingInput = e.currentTarget
      .previousElementSibling as HTMLInputElement;

    if (showPassword) {
      siblingInput.type = "password";
      setShowPassword(false);
    } else {
      siblingInput.type = "text";
      setShowPassword(true);
    }
  };

  return (
    <div className={styles.email} id="input">
      <span className={styles.title}>{title}</span>
      <div className={styles.registerInputBox}>
        <input
          ref={inputRef}
          className={styles.registerInput}
          type={inputType}
          maxLength={inputMaxLength}
          placeholder={inputPlaceholder}
          onChange={(e) => dispatch(setValue(e.target.value))}
          onBlur={(e) => validateInput(e.currentTarget, inputValue, password)}
        />
        <button className={styles.show} onClick={(e) => onShowClicked(e)}>
          {showPassword ? <BsEyeSlash /> : <BsEye />}
        </button>
        <button className={styles.X} onClick={(e) => onXClicked(e)}>
          <BsX />
        </button>
      </div>
      <div className={styles.errMsg}></div>
    </div>
  );
}
