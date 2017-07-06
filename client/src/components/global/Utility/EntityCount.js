import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class EntityCount extends PureComponent {

  static propTypes = {
    pagination: PropTypes.shape({
      currentPage: PropTypes.number.isRequired,
      perPage: PropTypes.number.isRequired,
      totalCount: PropTypes.number.isRequired
    }).isRequired,
    singularUnit: PropTypes.string.isRequired,
    pluralUnit: PropTypes.string.isRequired
  }

  render() {
    const { perPage, currentPage, totalCount } = this.props.pagination;
    const start = (perPage * (currentPage - 1)) + 1;
    let end = totalCount < perPage ? totalCount : (perPage * currentPage);
    if (end > totalCount) end = totalCount;
    const label = totalCount > 1 ? this.props.pluralUnit : this.props.singularUnit;
    return (
      <p className="list-total">
        {'Showing '}
        <span>{`${start}-${end}`}</span>
        {' of '}
        <span>{totalCount}</span>
        {` ${label}: `}
      </p>
    );
  }

}
