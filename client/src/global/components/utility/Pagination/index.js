import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import range from "lodash/range";
import isString from "lodash/isString";
import IconComposer from "../IconComposer";
import * as Styled from "./styles";

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

    return (
      <Styled.Link
        as={PageComponent}
        aria-disabled={!pagination.prevPage}
        {...pageProps}
      >
        <IconComposer icon="arrowLongLeft16" screenReaderText="previous page" />
        <span>Prev</span>
      </Styled.Link>
    );
  }

  next(pagination) {
    const handler = this.props.paginationClickHandler(pagination.nextPage);
    const { PageComponent, pageProps } = this.propsAndComponentForPage(handler);

    return (
      <Styled.Link
        as={PageComponent}
        aria-disabled={!pagination.nextPage}
        {...pageProps}
      >
        <span>Next</span>
        <IconComposer icon="arrowLongRight16" screenReaderText="next page" />
      </Styled.Link>
    );
  }

  number(page, handler) {
    const { PageComponent, pageProps } = this.propsAndComponentForPage(handler);

    return (
      <Styled.Link key={page.number} as={PageComponent} {...pageProps}>
        <span aria-hidden="true">{page.number}</span>
        <span className="screen-reader-text">Go to page: {page.number}</span>
      </Styled.Link>
    );
  }

  current(page, handler) {
    const { PageComponent, pageProps } = this.propsAndComponentForPage(handler);

    return (
      <Styled.Link
        key={page.number}
        as={PageComponent}
        aria-current="page"
        {...pageProps}
      >
        <span aria-hidden="true">{page.number}</span>
        <span className="screen-reader-text">Go to page: {page.number}</span>
      </Styled.Link>
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
      <span>
        Page {pagination.currentPage}
        {` `}/{` `}
        {pagination.totalPages}
      </span>
    );
  }

  render() {
    if (!this.props.pagination) return null;

    const pages = this.visiblePageArray(this.props.pagination);
    const pagination = this.props.pagination;
    if (pagination.totalPages === 1 || pagination.totalPages === 0) return null;

    return (
      <Styled.Nav aria-label="Pagination">
        <Styled.Columns>
          <Styled.Column>{this.previous(pagination)}</Styled.Column>
          <Styled.Column>
            <Styled.Pages>
              {this.props.compact
                ? this.renderCompact(pagination)
                : this.renderRange(pages)}
            </Styled.Pages>
          </Styled.Column>
          <Styled.Column>{this.next(pagination)}</Styled.Column>
        </Styled.Columns>
      </Styled.Nav>
    );
  }
}
