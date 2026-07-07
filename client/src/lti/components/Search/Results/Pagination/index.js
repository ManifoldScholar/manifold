import PropTypes from "prop-types";
import Count from "./Count";
import PageNavigation from "./PageNavigation";
import PageSize from "./PageSize";
import * as Styled from "./styles";

export default function Pagination({ meta }) {
  return (
    <Styled.Wrapper>
      <Count totalCount={meta?.pagination.totalCount} />
      <PageNavigation totalPages={meta?.pagination.totalPages || 1} />
      <PageSize />
    </Styled.Wrapper>
  );
}

Pagination.propTypes = {
  meta: PropTypes.shape({
    pagination: PropTypes.shape({
      totalCount: PropTypes.number,
      totalPages: PropTypes.number
    })
  })
};
