import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Filters from "./Filters";
import Pagination from "./Pagination";
import Body from "./Body";
import Column from "./Column";

export default class Table extends PureComponent {
  static displayName = "GenericTable";

  static propTypes = {
    pagination: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired,
    unit: PropTypes.string.isRequired,
    filters: PropTypes.node,
    filterCount: PropTypes.number,
    children: props => {
      React.Children.toArray(props.children).every(
        child => child.type === Column
      );
    }
  };

  get containerClassNames() {
    return classNames({
      "group-name": true
    });
  }

  get paginationTarget() {
    return "#pagination-target";
  }

  get entityCountProps() {
    return {
      pagination: this.props.pagination,
      unit: this.props.unit,
      showRange: true
    };
  }

  render() {
    const {
      pagination,
      onPageClick,
      countLabel,
      filters,
      filterCount
    } = this.props;
    return (
      <div className={this.containerClassNames}>
        <Filters
          filters={filters}
          filterCount={filterCount}
          entityCountProps={this.entityCountProps}
        />
        <Body {...this.props} markup="table" label={countLabel} />
        <Body {...this.props} markup="dl" label={countLabel} />
        <Pagination
          pagination={pagination}
          paginationTarget={this.paginationTarget}
          onPageClick={onPageClick}
        />
      </div>
    );
  }
}
