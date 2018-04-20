import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import range from "lodash/range";
import isString from "lodash/isString";

export default class UtilityPagination extends PureComponent {
  static displayName = "Utility.Pagination";

  static propTypes = {
    pagination: PropTypes.object,
    paginationTarget: PropTypes.string,
    padding: PropTypes.number,
    paginationClickHandler: PropTypes.func,
    level: PropTypes.string
  };

  static defaultProps = {
    padding: 3,
    paginationTarget: "#pagination-target",
    level: "primary"
  };

  visiblePageArray(pagination) {
    const current = pagination.currentPage;
    let start = current - this.props.padding;
    if (start < 1) start = 1;
    let last = current + this.props.padding;
    if (last > pagination.totalPages) last = pagination.totalPages;
    const pages = range(start, last + 1);
    const out = pages.map(page => {
      return {
        number: page,
        key: page,
        current: page === current,
        first: page === 1,
        last: page === pagination.totalPages
      };
    });
    return out;
  }

  previous(pagination) {
    const handler = this.props.paginationClickHandler(pagination.prevPage);
    const disabledClass = pagination.prevPage ? "" : "disabled";
    return (
      <li className={`pagination-previous ${disabledClass}`} key="previous">
        {isString(handler) ? (
          <Link to={handler}>
            <i className="manicon manicon-arrow-long-left" />
            <span>Prev</span>
          </Link>
        ) : (
          <a
            href={this.props.paginationTarget}
            onClick={handler}
            data-id={"page-prev"}
          >
            <i className="manicon manicon-arrow-long-left" />
            <span>Prev</span>
          </a>
        )}
      </li>
    );
  }

  next(pagination) {
    const handler = this.props.paginationClickHandler(pagination.nextPage);
    const disabledClass = pagination.nextPage ? "" : "disabled";
    return (
      <li className={`pagination-next ${disabledClass}`} key="next">
        {isString(handler) ? (
          <Link to={handler}>
            <span>Next</span>
            <i className="manicon manicon-arrow-long-right" />
          </Link>
        ) : (
          <a
            href={this.props.paginationTarget}
            onClick={handler}
            data-id={"page-next"}
          >
            <span>Next</span>
            <i className="manicon manicon-arrow-long-right" />
          </a>
        )}
      </li>
    );
  }

  number(page, handler) {
    return (
      <li key={page.key} className="ordinal">
        {isString(handler) ? (
          <Link to={handler}>{page.number}</Link>
        ) : (
          <a href={this.props.paginationTarget} onClick={handler}>
            {page.number}
          </a>
        )}
      </li>
    );
  }

  current(page, handler) {
    return (
      <li className="active ordinal" key={page.key}>
        {isString(handler) ? (
          <Link to={handler}>{page.number}</Link>
        ) : (
          <a href={this.props.paginationTarget} onClick={handler}>
            {page.number}
          </a>
        )}
      </li>
    );
  }

  render() {
    if (!this.props.pagination) return null;

    const pages = this.visiblePageArray(this.props.pagination);
    const pagination = this.props.pagination;
    if (pagination.totalPages === 1 || pagination.totalPages === 0) return null;

    return (
      <nav className={`list-pagination-${this.props.level}`}>
        <ul>
          {this.previous(pagination)}
          {pages.map(page => {
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
