import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class TableCount extends React.PureComponent {

  static propTypes = {
  }

  get tableCountContainerClassNames() {
    return "group-table__count-container";
  }

  get tableCountHeading() {
    return classNames({
      "group-table__table-count-heading": true,
      "group-table__heading-small": true
    });
  }

  get tableCountFigure() {
    return "group-table__count-figure";
  }

  render() {

    const {pagination, currentPageCount} = this.props;

    return (
      <div className={this.tableCountContainerClassNames}>
        <h4 className={this.tableCountHeading}>
          {"Showing "}
          <span className={this.tableCountFigure}>
            {currentPageCount}
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
