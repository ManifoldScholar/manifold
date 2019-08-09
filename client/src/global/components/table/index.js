import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";
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

  render() {
    const { pagination, onPageClick, countLabel } = this.props;
    return (
      <div className={this.containerClassNames}>
        <div className={"table__count-container"}>
          <Utility.EntityCount
            pagination={pagination}
            singularUnit={this.props.singularUnit}
            pluralUnit={this.props.pluralUnit}
            showRange={false}
          />
        </div>
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
