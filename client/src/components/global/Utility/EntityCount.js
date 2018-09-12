import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class EntityCount extends PureComponent {
  static propTypes = {
    pagination: PropTypes.shape({
      currentPage: PropTypes.number.isRequired,
      perPage: PropTypes.number.isRequired,
      totalCount: PropTypes.number.isRequired
    }).isRequired,
    singularUnit: PropTypes.string.isRequired,
    pluralUnit: PropTypes.string.isRequired,
    countOnly: PropTypes.bool
  };

  static defaultProps = {
    countOnly: false
  };

  renderRange(start, end, totalCount, label) {
    return (
      <p className="list-total">
        {"Showing "}
        <span>{`${start}-${end}`}</span>
        {" of "}
        <span>{totalCount}</span>
        {` ${label}: `}
      </p>
    );
  }

  renderCount(totalCount, label) {
    return (
      <p className="list-total">
        <span>{totalCount}</span>
        {` ${label}`}
      </p>
    );
  }

  render() {
    const { perPage, currentPage, totalCount } = this.props.pagination;
    let start = perPage * (currentPage - 1);
    if (totalCount > 0) start += 1;
    let end = totalCount < perPage ? totalCount : perPage * currentPage;
    if (end > totalCount) end = totalCount;
    const label =
      totalCount > 1 || totalCount === 0
        ? this.props.pluralUnit
        : this.props.singularUnit;

    return this.props.countOnly
      ? this.renderCount(totalCount, label)
      : this.renderRange(start, end, totalCount, label);
  }
}
