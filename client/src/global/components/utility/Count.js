import React from "react";
import PropTypes from "prop-types";

export default class Count extends React.PureComponent {
  static propTypes = {
    pagination: PropTypes.object.isRequired,
    countLabel: PropTypes.string.isRequired
  };

  get figureClassNames() {
    return "pagination-count__figure";
  }

  get pagination() {
    return this.props.pagination;
  }

  get countLabel() {
    return this.props.countLabel;
  }

  get currentPageCount() {
    const pagination = this.pagination;
    const pageRemainder = pagination.totalCount % pagination.perPage;

    if (pagination.currentPage > pagination.totalPages || pageRemainder === 0) {
      return pagination.perPage;
    } else {
      return pageRemainder;
    }
  }

  render() {
    return (
      <h4 className="pagination-count">
        {"Showing "}
        <span className={this.figureClassNames}>{this.currentPageCount}</span>
        {" of "}
        <span className={this.figureClassNames}>
          {this.pagination.totalCount}
        </span>
        {` ${this.countLabel}:`}
      </h4>
    );
  }
}
