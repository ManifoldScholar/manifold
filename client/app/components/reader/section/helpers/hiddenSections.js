export const getNextVisible = (map, index) => {
  if (!map[index + 1] || index === -1) return null;
  if (map[index + 1].hidden) return getNextVisible(map, index + 1);
  return map[index + 1];
};

export const getPrevVisible = (map, index) => {
  if (!map[index - 1] || index === -1) return null;
  if (map[index - 1].hidden) return getPrevVisible(map, index - 1);
  return map[index - 1];
};
