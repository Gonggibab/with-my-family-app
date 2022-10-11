import { UserAPI } from 'api/UserAPI';

export const validateEmail = async (target: HTMLInputElement, str: string) => {
  const regex =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  const inputElement = target.parentElement as HTMLInputElement;
  const errorElement = target.parentElement?.nextElementSibling as HTMLElement;

  if (str === '') {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '필수 입력란입니다';
    return false;
  } else if (!str.match(regex)) {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '이메일 양식이 맞지 않습니다';
    return false;
  } else {
    const email = { email: str };

    const checkDup = await UserAPI.checkDuplicateEmail(email).then((res) => {
      if (res.status === 400) {
        inputElement.style.border = `1px solid #cc1313`;
        errorElement.innerHTML =
          '서버와 연결에 문제가 있습니다. 다시 시도해주세요';
        return false;
      } else {
        if (res.data.isDuplicateEmail) {
          inputElement.style.border = `1px solid #cc1313`;
          errorElement.innerHTML = '이미 존재하는 이메일입니다.';
          return false;
        } else {
          inputElement.style.border = 'none';
          errorElement.innerHTML = '';
          return true;
        }
      }
    });

    return checkDup;
  }
};

export const validatePassword = (
  target: HTMLInputElement,
  str: string,
  password?: string
) => {
  const regex = '^.{8,}$';
  const inputElement = target.parentElement as HTMLInputElement;
  const errorElement = target.parentElement?.nextElementSibling as HTMLElement;

  if (str === '') {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '필수 입력란입니다';
    return false;
  } else if (!str.match(regex)) {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '비밀번호는 8자 이상이어야 합니다';
    return false;
  } else if (str === password) {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '이전 비밀번호와 동일합니다';
    return false;
  } else {
    inputElement.style.border = 'none';
    errorElement.innerHTML = '';
    return true;
  }
};

export const validatePassCheck = (
  target: HTMLInputElement,
  str: string,
  password?: string
): boolean => {
  const inputElement = target.parentElement as HTMLInputElement;
  const errorElement = target.parentElement?.nextElementSibling as HTMLElement;

  if (str === '') {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '필수 입력란입니다';
    return false;
  } else if (password && str !== password) {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '비밀번호가 일치하지 않습니다';
    return false;
  } else {
    inputElement.style.border = 'none';
    errorElement.innerHTML = '';
    return true;
  }
};

export const validateName = (target: HTMLInputElement, str: string) => {
  const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|]+$/;
  const inputElement = target.parentElement as HTMLInputElement;
  const errorElement = target.parentElement?.nextElementSibling as HTMLElement;

  if (str === '') {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '필수 입력란입니다';
    return false;
  } else if (!str.match(regex)) {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '이름은 한글 및 영어만 가능합니다';
    return false;
  } else {
    inputElement.style.border = 'none';
    errorElement.innerHTML = '';
    return true;
  }
};

const isNotValidDate = (date: string, regex: RegExp) => {
  var month = date.substring(5, 7);
  var day = date.substring(8, 10);

  if (!date.match(regex)) return true;

  if (+month > 12 || +month < 1) return true;

  if (+day > 31 || +day < 1) return true;

  return false;
};

export const validatebDay = (target: HTMLInputElement, str: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const inputElement = target.parentElement as HTMLInputElement;
  const errorElement = target.parentElement?.nextElementSibling as HTMLElement;

  if (str === '') {
    inputElement.style.border = 'none';
    errorElement.innerHTML = '';
    return true;
  } else if (isNotValidDate(str, regex)) {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = 'YYYY-MM-DD 형태로 입력해주세요';
    return false;
  } else {
    inputElement.style.border = 'none';
    errorElement.innerHTML = '';
    return true;
  }
};

export const validateCurPassword = async (
  target: HTMLInputElement,
  str: string
) => {
  const inputElement = target.parentElement as HTMLInputElement;
  const errorElement = target.parentElement?.nextElementSibling as HTMLElement;

  if (str === '') {
    inputElement.style.border = `1px solid #cc1313`;
    errorElement.innerHTML = '필수 입력란입니다';
    return false;
  } else {
    const userRes = await UserAPI.checkPassword(str);

    if (!userRes.data.success) {
      inputElement.style.border = `1px solid #cc1313`;
      errorElement.innerHTML = '비밀번호가 일치하지 않습니다';
      return false;
    } else {
      inputElement.style.border = `none`;
      errorElement.innerHTML = '';
    }
    return true;
  }
};

export const validateAllInputs = async (
  target: HTMLButtonElement,
  email: string,
  password: string,
  passCheck: string,
  name: string,
  bDay: string
) => {
  const inputs = target.parentElement!.querySelectorAll('#input');

  const isValidEmail = await validateEmail(
    inputs[0].querySelector('input') as HTMLInputElement,
    email
  );
  const isValidPassword = validatePassword(
    inputs[1].querySelector('input') as HTMLInputElement,
    password
  );
  const isValidPassCheck = validatePassCheck(
    inputs[2].querySelector('input') as HTMLInputElement,
    passCheck,
    password
  );
  const isValidName = validateName(
    inputs[3].querySelector('input') as HTMLInputElement,
    name
  );
  const isValidBDay = validatebDay(
    inputs[4].querySelector('input') as HTMLInputElement,
    bDay
  );

  return (
    isValidEmail &&
    isValidPassword &&
    isValidPassCheck &&
    isValidName &&
    isValidBDay
  );
};

export const validateNameNBday = (
  target: HTMLButtonElement,
  name: string,
  birthday: string
) => {
  const inputs =
    target.parentElement!.parentElement!.querySelectorAll('#input');

  const isValidName = validateName(
    inputs[0].querySelector('input') as HTMLInputElement,
    name
  );
  const isValidBday = validatebDay(
    inputs[1].querySelector('input') as HTMLInputElement,
    birthday
  );

  return isValidName && isValidBday;
};

export const validatePasswords = async (
  target: HTMLButtonElement,
  curPassword: string,
  nextPassword: string,
  checkPassword: string
) => {
  const inputs =
    target.parentElement!.parentElement!.querySelectorAll('#input');

  const isValidCurPass = await validateCurPassword(
    inputs[0].querySelector('input') as HTMLInputElement,
    curPassword
  );
  const isValidNextPass = validatePassword(
    inputs[1].querySelector('input') as HTMLInputElement,
    nextPassword,
    curPassword
  );
  const isValidPassCheck = validatePassCheck(
    inputs[2].querySelector('input') as HTMLInputElement,
    checkPassword,
    nextPassword
  );
  return isValidCurPass && isValidNextPass && isValidPassCheck;
};
