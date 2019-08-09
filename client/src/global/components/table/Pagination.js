import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class TablePagination extends React.PureComponent {
  static propTypes = {};

  static displayName = "GenericTable.Pagination";

  get paginationClassNames() {
    return "table__pagination";
  }

  render() {
    const { pagination, onPageClick, paginationTarget } = this.props;

    return (
      <div className={this.paginationClassNames}>
        <Utility.Pagination
          pagination={pagination}
          paginationTarget={paginationTarget}
          paginationClickHandler={onPageClick}
        />
      </div>
    );
  }
}
