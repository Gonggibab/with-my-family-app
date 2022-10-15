const convertMessageTime = (date: string) => {
  // const hour = Number(date.substring(16, 18));
  const idx = date.indexOf(':');

  const hour = Number(date.substring(idx - 2, idx)) - 3;
  const minute = date.substring(idx + 1, idx + 3);

  let meridiem = '';
  if (hour - 12 <= 0) meridiem = '오전 ';
  else meridiem = '오후 ';

  const string = meridiem + (hour % 12) + ':' + minute;
  return string;
};

export default convertMessageTime;
