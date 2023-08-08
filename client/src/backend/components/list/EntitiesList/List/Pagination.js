import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ListEntitiesListPagination extends PureComponent {
  static displayName = "List.Entities.List.Pagination";

  static propTypes = {
    pagination: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired,
    paginationTarget: PropTypes.string,
    style: PropTypes.oneOf(["normal", "compact"]),
    padding: PropTypes.number
  };

  static defaultProps = {
    style: "normal"
  };

  get pagination() {
    return this.props.pagination;
  }

  get style() {
    return this.props.style;
  }

  get styleProps() {
    if (this.style === "compact") {
      return { compact: true };
    }
    return { compact: false, padding: this.props.padding };
  }

  get onPageClick() {
    return this.props.onPageClick;
  }

  get paginationTarget() {
    return this.props.paginationTarget ?? "#";
  }

  get padding() {
    return this.props.padding;
  }

  render() {
    return (
      <div className="entity-list__pagination">
        <Utility.Pagination
          pagination={this.pagination}
          paginationTarget={this.paginationTarget}
          paginationClickHandler={this.onPageClick}
          {...this.styleProps}
        />
      </div>
    );
  }
}
