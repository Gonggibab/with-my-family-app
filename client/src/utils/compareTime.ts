const compareTime = (a: string, b: string) => {
  const dateA = Number(
    a.substring(0, 4) +
      a.substring(5, 7) +
      a.substring(8, 10) +
      a.substring(11, 13) +
      a.substring(14, 16) +
      a.substring(17, 19) +
      a.substring(20, 23)
  );
  const dateB = Number(
    b.substring(0, 4) +
      b.substring(5, 7) +
      b.substring(8, 10) +
      b.substring(11, 13) +
      b.substring(14, 16) +
      b.substring(17, 19) +
      b.substring(20, 23)
  );

  if (dateA > dateB) {
    console.log(`${dateA} more recent than ${dateB}`);
    return -1;
  }
  if (dateA < dateB) {
    console.log(`${dateB} more recent than ${dateA}`);
    return 1;
  }
  return 0;
};

export default compareTime;
