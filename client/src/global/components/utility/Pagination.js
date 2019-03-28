import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import range from "lodash/range";
import isString from "lodash/isString";
import classNames from "classnames";
import IconComposer from "./IconComposer";

export default class UtilityPagination extends PureComponent {
  static displayName = "Utility.Pagination";

  static propTypes = {
    pagination: PropTypes.object,
    paginationTarget: PropTypes.string,
    padding: PropTypes.number,
    paginationClickHandler: PropTypes.func,
    compact: PropTypes.bool
  };

  static defaultProps = {
    padding: 3,
    paginationTarget: "#pagination-target"
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

  propsAndComponentForPage(handler) {
    let PageComponent;
    let pageProps;
    if (isString(handler)) {
      PageComponent = Link;
      pageProps = { to: handler };
    } else {
      PageComponent = "a";
      pageProps = { onClick: handler, href: this.props.paginationTarget };
    }
    return { PageComponent, pageProps };
  }

  previous(pagination) {
    const handler = this.props.paginationClickHandler(pagination.prevPage);
    const { PageComponent, pageProps } = this.propsAndComponentForPage(handler);

    const pageClassNames = classNames({
      "list-pagination__page": true,
      "list-pagination__page--prev": true,
      "list-pagination__page--disabled": !pagination.prevPage
    });

    return (
      <li className={pageClassNames} key="previous">
        <PageComponent {...pageProps} disabled={!pagination.prevPage}>
          <IconComposer
            icon="arrowLongLeft16"
            screenReaderText="previous page"
          />
          <span className="list-pagination__icon-label">PREV</span>
        </PageComponent>
      </li>
    );
  }

  next(pagination) {
    const handler = this.props.paginationClickHandler(pagination.nextPage);
    const { PageComponent, pageProps } = this.propsAndComponentForPage(handler);

    const pageClassNames = classNames({
      "list-pagination__page": true,
      "list-pagination__page--next": true,
      "list-pagination__page--disabled": !pagination.nextPage
    });

    return (
      <li className={pageClassNames} key="next">
        <PageComponent {...pageProps}>
          <span className="list-pagination__icon-label">NEXT</span>
          <IconComposer icon="arrowLongRight16" screenReaderText="next page" />
        </PageComponent>
      </li>
    );
  }

  number(page, handler) {
    const { PageComponent, pageProps } = this.propsAndComponentForPage(handler);

    const pageClassNames = classNames({
      "list-pagination__page": true,
      "list-pagination__page--ordinal": true
    });

    return (
      <li className={pageClassNames} key={page.key}>
        <PageComponent {...pageProps}>
          <span aria-hidden="true">{page.number}</span>
          <span className="screen-reader-text">Go to page: {page.number}</span>
        </PageComponent>
      </li>
    );
  }

  current(page, handler) {
    const { PageComponent, pageProps } = this.propsAndComponentForPage(handler);

    const pageClassNames = classNames({
      "list-pagination__page": true,
      "list-pagination__page--ordinal": true,
      "list-pagination__page--disabled": true
    });

    return (
      <li className={pageClassNames} key={page.key}>
        <PageComponent {...pageProps}>
          <span aria-hidden="true">{page.number}</span>
          <span className="screen-reader-text">Go to page: {page.number}</span>
        </PageComponent>
      </li>
    );
  }

  renderRange(pages) {
    return pages.map(page => {
      const url = this.props.paginationClickHandler(page.number);
      if (page.current) {
        return this.current(page, url);
      }
      return this.number(page, url);
    });
  }

  renderCompact(pagination) {
    return (
      <li>
        <span>
          Page {pagination.currentPage}
          {` `}/{` `}
          {pagination.totalPages}
        </span>
      </li>
    );
  }

  render() {
    if (!this.props.pagination) return null;

    const pages = this.visiblePageArray(this.props.pagination);
    const pagination = this.props.pagination;
    if (pagination.totalPages === 1 || pagination.totalPages === 0) return null;

    const wrapperClassNames = classNames({
      "list-pagination": true,
      "list-pagination--compact": this.props.compact
    });

    return (
      <nav className={wrapperClassNames}>
        <ul className="list-pagination__columns">
          <li className="list-pagination__column">
            <ul>{this.previous(pagination)}</ul>
          </li>
          <li className="list-pagination__column-middle">
            <ul className="list-pagination__pages">
              {this.props.compact
                ? this.renderCompact(pagination)
                : this.renderRange(pages)}
            </ul>
          </li>
          <li className="list-pagination__column">
            <ul>{this.next(pagination)}</ul>
          </li>
        </ul>
      </nav>
    );
  }
}
