import React from "react";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import * as Styled from "./styles";

function EntityListTotal({
  linkTo,
  entityName,
  count = 0,
  alignLeft,
  tight,
  className
}) {
  return (
    <Styled.Wrapper $alignLeft={alignLeft} $tight={tight} className={className}>
      <Styled.Link to={linkTo}>
        <Styled.Value>{count.toLocaleString()}</Styled.Value>
        {` Total ${pluralize(entityName, count)}`}
        <Styled.Icon size={30} icon="arrowLongRight16" />
      </Styled.Link>
    </Styled.Wrapper>
  );
}

EntityListTotal.displayName = "Global.Composed.EntityListTotal";

EntityListTotal.propTypes = {
  linkTo: PropTypes.string.isRequired,
  entityName: PropTypes.string.isRequired,
  count: PropTypes.number,
  alignLeft: PropTypes.bool,
  tight: PropTypes.bool
};

export default EntityListTotal;
