import dateToString from './dateToString';

const stringToDate = (str: string) => {
  console.log(str);
  const date = new Date(
    +str.substring(0, 4),
    +str.substring(5, 7),
    +str.substring(8, 10)
  );
  console.log(dateToString(String(date)));
  return date;
};

export default stringToDate;
