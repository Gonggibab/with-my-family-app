const convertMessageTime = (date: string) => {
  const idx = date.indexOf(':');
  let hour = Number(date.substring(idx - 2, idx)) + 9;
  const minute = date.substring(idx + 1, idx + 3);

  let meridiem = '';
  if (hour - 12 <= 0) meridiem = '오전 ';
  else meridiem = '오후 ';

  hour = hour % 12 === 0 ? 12 : hour % 12;

  const string = meridiem + hour + ':' + minute;
  return string;
};

export default convertMessageTime;
