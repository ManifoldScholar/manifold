import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class TableCount extends React.PureComponent {

  static propTypes = {
  }

  get tableCountContainerClassNames() {
    return "table__count-container";
  }

  get tableCountHeading() {
    return classNames({
      "table__table-count-heading": true,
      "table__heading-small": true
    });
  }

  get tableCountFigure() {
    return "table__count-figure";
  }

  get pagination() {
    return this.props.pagination;
  }

  get currentPageCount() {
    const pagination = this.pagination;
    const pageRemainder = pagination.totalCount % pagination.perPage;

    if (pagination.currentPage > pagination.totalPages
      ||  pageRemainder === 0) {
      return pagination.perPage;
    } else {
      return pageRemainder;
    }
  }


  render() {
    const pagination = this.pagination;

    return (
      <div className={this.tableCountContainerClassNames}>
        <h4 className={this.tableCountHeading}>
          {"Showing "}
          <span className={this.tableCountFigure}>
            {this.currentPageCount}
          </span>
          {" of "}
          <span className={this.tableCountFigure}>
            {pagination.totalCount}
          </span>
          {" Groups:"}
        </h4>
      </div>
    );
  }
}
