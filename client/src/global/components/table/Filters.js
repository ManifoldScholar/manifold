import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

function Filters({ filters, entityCountProps }) {
  return (
    <div
      className={classNames({
        "table-filter-container": true,
        "table-filter-container--count-only": !filters
      })}
    >
      <div className="table-filter-container__start">
        <Utility.EntityCount {...entityCountProps} />
      </div>
      {filters && <div className="table-filter-container__end">{filters}</div>}
    </div>
  );
}

Filters.displayName = "GenericTable.Filters";

Filters.propTypes = {
  filters: PropTypes.node,
  entityCountProps: PropTypes.object
};

export default Filters;
