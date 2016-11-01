import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import range from 'lodash/range';

export default class UtilityPagination extends Component {

  static displayName = "Utility.Pagination";

  static propTypes = {
    pagination: PropTypes.object,
    padding: PropTypes.number,
    urlBuilder: PropTypes.func
  };

  static defaultProps = {
    padding: 3
  }

  constructor() {
    super();
  }

  visiblePageArray(pagination) {
    const current = pagination.currentPage;
    let start = current - this.props.padding;
    if (start < 1) start = 1;
    let last = current + this.props.padding;
    if (last > pagination.totalPages) last = pagination.totalPages;
    const pages = range(start, last + 1);
    const out = pages.map((page) => {
      return {
        number: page,
        key: page,
        current: page === current,
        first: page === 1,
        last: page === pagination.totalPages,
      };
    });
    return out;
  }

  previous(pagination) {
    const url = this.props.urlBuilder(pagination.prevPage);
    const style = pagination.prevPage ? {} : { visibility: "hidden" };
    return (
      <li style={style} className="pagination-previous" key="previous">
        <Link to={url}>
          <i className="manicon manicon-arrow-long-left"></i>
          Prev
        </Link>
      </li>
    );
  }

  next(pagination) {
    const url = this.props.urlBuilder(pagination.nextPage);
    const style = pagination.nextPage ? {} : { visibility: "hidden" };
    return (
      <li style={style} className="pagination-next" key="next">
        <Link to={url}>
          Next
          <i className="manicon manicon-arrow-long-right"></i>
        </Link>
      </li>
    );
  }

  number(page, url) {
    return (
      <li key={page.key}>
        <Link to={url}>
          {page.number}
        </Link>
      </li>
    );
  }

  current(page, url) {
    return (
      <li className="active" key={page.key}>
        <Link to={url}>
          {page.number}
        </Link>
      </li>
    );
  }

  render() {
    const pages = this.visiblePageArray(this.props.pagination);
    const pagination = this.props.pagination;

    return (
      <nav className="list-pagination">
        <ul>
          {this.previous(pagination)}
          {pages.map((page) => {
            const url = this.props.urlBuilder(page.number);
            if (page.current) {
              return this.current(page, url);
            }
            return this.number(page, url);
          })}
          {this.next(pagination)}
        </ul>
      </nav>
    );
  }

}
