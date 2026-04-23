import Pagination from "components/global/utility/Pagination";
import * as Styled from "./styles";

export default function LtiPager({
  meta,
  wide = false,
  paginationClickHandler
}) {
  const pagination = meta?.pagination;
  if (!pagination || !pagination.totalPages || pagination.totalPages < 2) {
    return null;
  }
  return (
    <Styled.Wrapper>
      <Pagination
        pagination={pagination}
        wide={wide}
        paginationClickHandler={paginationClickHandler}
      />
    </Styled.Wrapper>
  );
}
