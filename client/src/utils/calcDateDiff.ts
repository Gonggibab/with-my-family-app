export const calcDateDiff = (updatedAt?: string) => {
  if (!updatedAt) return;

  const updated = new Date(updatedAt);
  const now = new Date();

  // calculate time difference in millisecond
  const diff = now.getTime() - updated.getTime();

  // millisecond to minute
  const min = Math.floor(diff / (1000 * 60));

  if (min >= 525600) {
    return `${Math.floor(min / 525600)}년 전`;
  }
  if (min >= 43800) {
    return `${Math.floor(min / 43800)}달 전`;
  }
  if (min >= 1440) {
    return `${Math.floor(min / 1440)}일 전`;
  }
  if (min >= 60) {
    return `${Math.floor(min / 60)}시간 전`;
  }
  if (min >= 1) {
    return `${Math.floor(min)}분 전`;
  } else {
    return '방금 전';
  }
};
