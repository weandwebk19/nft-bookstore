export const truncate = (s, start, end) => {
  return `${s.slice(0, start)}...${s.slice(end)}`;
};
