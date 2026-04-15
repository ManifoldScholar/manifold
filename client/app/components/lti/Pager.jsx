import Pagination from "components/global/utility/Pagination";

export default function LtiPager({ meta, wide = false, paginationClickHandler }) {
  const pagination = meta?.pagination;
  if (!pagination || !pagination.totalPages || pagination.totalPages < 2) {
    return null;
  }
  return (
    <Pagination
      pagination={pagination}
      wide={wide}
      paginationClickHandler={paginationClickHandler}
    />
  );
}
