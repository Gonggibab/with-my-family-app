import { MouseEvent, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { BsX } from "react-icons/bs";

import { RegisterInputProps } from "./RegisterBox";

import styles from "../../styles/components/Register/RegisterInput.module.scss";

export default function RegisterInput({
  title,
  inputType,
  inputMaxLength,
  inputPlaceholder,
  inputValue,
  setValue,
  validateInput,
}: RegisterInputProps) {
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = inputValue;
    }
  }, [inputValue]);

  const onXClicked = (e: MouseEvent<HTMLButtonElement>) => {
    const siblingInput = e.currentTarget
      .previousElementSibling as HTMLInputElement;
    const inputElement = e.currentTarget.parentElement as HTMLInputElement;
    const errorElement = e.currentTarget.parentElement
      ?.nextElementSibling as HTMLElement;

    siblingInput.value = "";
    inputElement.style.border = "none";
    errorElement.innerHTML = "";
    dispatch(setValue(""));
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
          onBlur={(e) => validateInput(e.currentTarget, inputValue)}
        />
        <button className={styles.X} onClick={(e) => onXClicked(e)}>
          <BsX />
        </button>
      </div>
      <div className={styles.errMsg}></div>
    </div>
  );
}
