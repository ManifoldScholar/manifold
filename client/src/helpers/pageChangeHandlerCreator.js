export const pageChangeHandlerCreator = handlePageChange => pageParam => {
  return event => {
    event.preventDefault();
    handlePageChange(pageParam);
  };
};
