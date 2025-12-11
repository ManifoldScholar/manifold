import React from "react";
import PropTypes from "prop-types";
import Utility from "components/global/utility";
import * as Styled from "./styles";

function Filters({ filters, filterCount = 0, entityCountProps }) {
  return (
    <Styled.Container $countOnly={!filters}>
      <Styled.Start>
        <Utility.EntityCount {...entityCountProps} />
      </Styled.Start>
      {filters && <Styled.End $count={filterCount}>{filters}</Styled.End>}
    </Styled.Container>
  );
}

Filters.displayName = "GenericTable.Filters";

Filters.propTypes = {
  filters: PropTypes.node,
  filterCount: PropTypes.number,
  entityCountProps: PropTypes.object
};

export default Filters;
