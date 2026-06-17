/**
 * Move an item within a list from `oldPos` to `newPos`, returning a new array
 * (the source list is left untouched). Used by the keyboard-reorder paths of the
 * native drag-and-drop lists.
 */
export const setOrderByChange = (list, oldPos, newPos) => {
  const ordered = Array.from(list);
  const [removed] = ordered.splice(oldPos, 1);
  ordered.splice(newPos, 0, removed);
  return ordered;
};
