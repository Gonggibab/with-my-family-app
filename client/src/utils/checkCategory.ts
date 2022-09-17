export const checkCategory = (url: string, category: string): boolean => {
  for (let index = 0; index < category.length; index++) {
    if (url[index] !== category[index]) {
      return false;
    }
  }

  return true;
};
