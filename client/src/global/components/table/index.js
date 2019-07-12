import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";
import TablePagination from "./Pagination";
import TableBody from "./Body";

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

  render() {
    const { pagination, onPageClick, countLabel } = this.props;

    return (
      <div className={this.containerClassNames}>
        <div className={"table__count-container"}>
          <Utility.Count pagination={pagination} countLabel={countLabel} />
        </div>
        <TableBody {...this.props} markup="table" label={countLabel} />
        <TableBody {...this.props} markup="dl" label={countLabel} />
        <TablePagination
          pagination={pagination}
          paginationTarget={this.paginationTarget}
          onPageClick={onPageClick}
        />
      </div>
    );
  }
}
