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
    singularUnit: PropTypes.string.isRequired,
    pluralUnit: PropTypes.string.isRequired,
    filters: PropTypes.node,
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
    return "#sample-target";
  }

  get entityCountProps() {
    return {
      pagination: this.props.pagination,
      singularUnit: this.props.singularUnit,
      pluralUnit: this.props.pluralUnit,
      showRange: false
    };
  }

  render() {
    const { pagination, onPageClick, countLabel, filters } = this.props;
    return (
      <div className={this.containerClassNames}>
        <Filters filters={filters} entityCountProps={this.entityCountProps} />
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
