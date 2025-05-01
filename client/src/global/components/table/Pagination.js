import React from "react";
import Utility from "global/components/utility";

export default class TablePagination extends React.PureComponent {
  static propTypes = {};

  static displayName = "GenericTable.Pagination";

  get paginationClassNames() {
    return "table__pagination";
  }

  render() {
    const { pagination } = this.props;

    return (
      <div className={this.paginationClassNames}>
        <Utility.Pagination pagination={pagination} />
      </div>
    );
  }
}
