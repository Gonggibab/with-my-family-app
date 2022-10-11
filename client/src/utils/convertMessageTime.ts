const convertMessageTime = (date: string) => {
  const hour = Number(date.substring(16, 18));
  const minute = date.substring(19, 21);

  let meridiem = '';
  if (hour - 12 <= 0) meridiem = '오전 ';
  else meridiem = '오후 ';

  const string = meridiem + (hour % 12) + ':' + minute;
  return string;
};

export default convertMessageTime;
