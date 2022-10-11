export const convertURL = (url: string): string => {
  if (url.substring(0, 4) === 'http') {
    return url;
  } else {
    return `http://localhost:5000/${url}`;
  }
};
