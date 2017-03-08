import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import range from 'lodash/range';
import isString from 'lodash/isString';

export default class UtilityPagination extends PureComponent {

  static displayName = "Utility.Pagination";

  static propTypes = {
    pagination: PropTypes.object,
    padding: PropTypes.number,
    paginationClickHandler: PropTypes.func
  };

  static defaultProps = {
    padding: 3,
    paginationTarget: "#pagination-target"
  };

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
    const handler = this.props.paginationClickHandler(pagination.prevPage);
    const style = pagination.prevPage ? {} : { visibility: "hidden" };
    return (
      <li style={style} className="pagination-previous" key="previous">
        { isString(handler) ?
          <Link to={handler}>
            <i className="manicon manicon-arrow-long-left"></i>
            Prev
          </Link>
        :
          <a href={this.props.paginationTarget} onClick={handler}>
            <i className="manicon manicon-arrow-long-left"></i>
            Prev
          </a>
        }
      </li>
    );
  }

  next(pagination) {
    const handler = this.props.paginationClickHandler(pagination.nextPage);
    const style = pagination.nextPage ? {} : { visibility: "hidden" };
    return (
      <li style={style} className="pagination-next" key="next">
        { isString(handler) ?
          <Link to={handler}>
            Next
            <i className="manicon manicon-arrow-long-right"></i>
          </Link>
        :
          <a href={this.props.paginationTarget} onClick={handler}>
            Next
            <i className="manicon manicon-arrow-long-right"></i>
          </a>
        }
      </li>
    );
  }

  number(page, handler) {
    return (
      <li key={page.key} className="ordinal">
        { isString(handler) ?
          <Link to={handler}>
            {page.number}
          </Link>
          :
          <a href={this.props.paginationTarget} onClick={handler}>
            {page.number}
          </a>}
      </li>
    );
  }

  current(page, handler) {
    return (
      <li className="active ordinal" key={page.key}>
        { isString(handler) ?
          <Link to={handler}>
            {page.number}
          </Link>
        :
          <a href={this.props.paginationTarget} onClick={handler}>
            {page.number}
          </a>
        }
      </li>
    );
  }

  render() {
    if (!this.props.pagination) return null;

    const pages = this.visiblePageArray(this.props.pagination);
    const pagination = this.props.pagination;
    if (pagination.totalPages === 1) return null;

    return (
      <nav className="list-pagination-primary">
        <ul>
          {this.previous(pagination)}
          {pages.map((page) => {
            const url = this.props.paginationClickHandler(page.number);
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
