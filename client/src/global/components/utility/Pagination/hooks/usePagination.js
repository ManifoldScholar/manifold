import { useMemo } from "react";

export const ELLIPSIS_CHAR = "…";

function isOdd(num) {
  return num % 2 === 1;
}

function range(start, end) {
  const length = end - start + 1;
  /*
   * Create an array of a certain length and set the elements within it
   * from start value to end value.
   */
  return Array.from({ length }, (_, index) => index + start);
}

// Adapted from https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
export default function usePagination({
  currentPage,
  totalCount,
  perPage,
  padding = 2 // number of siblings to show on either side of current page
}) {
  const paginationRange = useMemo(() => {
    if (!currentPage || !totalCount || !perPage) return null;

    const totalPageCount = Math.ceil(totalCount / perPage);

    // Defined as padding + firstPage + lastPage + currentPage
    const visiblePageNumbers = padding + 3;

    /*
     * If the number of pages is less than the visible page numbers we want to show,
     * or if the visible page number count is odd and one less than the total page count,
     * we return the range [1..totalPageCount].
     * The latter condition resolves an edge case where an ellipsis
     * was added unnecessarily (e.g. [1, 2, 3, 4, 5, …, 6])
     */
    if (
      visiblePageNumbers >= totalPageCount ||
      (isOdd(visiblePageNumbers) && visiblePageNumbers + 1 === totalPageCount)
    ) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - padding, 1);
    const rightSiblingIndex = Math.min(currentPage + padding, totalPageCount);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPageCount - 2;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, visiblePageNumbers);
      return [...leftRange, ELLIPSIS_CHAR, totalPageCount];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(
        totalPageCount - visiblePageNumbers + 1,
        totalPageCount
      );
      return [1, ELLIPSIS_CHAR, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, ELLIPSIS_CHAR, ...middleRange, ELLIPSIS_CHAR, totalPageCount];
    }

    return range(1, totalPageCount);
  }, [totalCount, perPage, padding, currentPage]);

  return paginationRange;
}
