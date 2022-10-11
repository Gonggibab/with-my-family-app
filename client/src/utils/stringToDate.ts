import dateToString from './dateToString';

const stringToDate = (str: string) => {
  const date = new Date(str);
  return date;
};

export default stringToDate;
