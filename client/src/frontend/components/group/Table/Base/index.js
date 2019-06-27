import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";
import TableCount from "./Count";
import TablePagination from "./Pagination";
import TableBody from "./Body";
import { TableHeaderContext } from "helpers/contexts";

export default class Table extends PureComponent {

  static propTypes = {
    rowComponent: PropTypes.func.isRequired,
    groups: PropTypes.array,
    pagination: PropTypes.object
  };

  get containerClassNames() {
    return classNames({
      "group-name": true
    });
  }

  get paginationTarget() {
    return "#sample-target";
  }

  onPageClick() {
    console.log("page clicked");
  }

  render() {
    const { pagination} = this.props;

    return (
        <div className={this.containerClassNames}>
          <TableCount
            pagination={pagination}
          />
          <TableBody {...this.props} markup="table" />
          <TableBody {...this.props} markup="dl" />
          <TablePagination
            pagination={pagination}
            paginationTarget={this.paginationTarget}
            onPageClick={this.onPageClick}
          />
        </div>
    );
  }
}
