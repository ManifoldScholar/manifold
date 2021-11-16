import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default class EntityCount extends PureComponent {
  static propTypes = {
    pagination: PropTypes.shape({
      currentPage: PropTypes.number.isRequired,
      perPage: PropTypes.number.isRequired,
      totalCount: PropTypes.number.isRequired
    }).isRequired,
    singularUnit: PropTypes.string.isRequired,
    pluralUnit: PropTypes.string.isRequired,
    countOnly: PropTypes.bool,
    showRange: PropTypes.bool
  };

  static defaultProps = {
    countOnly: false,
    showRange: true
  };

  renderRange(start, end, totalCount, label) {
    return (
      <>
        <Styled.Total aria-hidden>
          {"Showing "}
          <Styled.Highlighted>
            {this.props.showRange ? `${start}-${end}` : end}
          </Styled.Highlighted>
          {" of "}
          <Styled.Highlighted>{totalCount}</Styled.Highlighted>
          {label && ` ${label}: `}
        </Styled.Total>
        {/* Better readout for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic
          className="screen-reader-text"
        >
          {`${totalCount} ${label &&
            label}. Showing results ${start} through ${end}.`}
        </div>
      </>
    );
  }

  renderCount(totalCount, label) {
    return (
      <Styled.Total role="status" aria-atomic aria-live="polite">
        <span>{totalCount}</span>
        {` ${label}`}
      </Styled.Total>
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
