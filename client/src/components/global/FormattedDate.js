import React, { Component } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import parse from "date-fns/parse";
import distanceInWords from "date-fns/distance_in_words";
import isDate from "lodash/isDate";

export default class FormattedDate extends Component {
  static displayName = "FormattedDate";

  static propTypes = {
    prefix: PropTypes.string,
    format: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  };

  formatDate(date) {
    if (!date) return;
    const out = isDate(date) ? date : parse(date);
    if (this.props.format === "distanceInWords")
      return distanceInWords(out, Date.now());
    const outFormat = this.props.format ? this.props.format : "MMMM DD, YYYY";
    return format(out, outFormat);
  }

  formatString(date) {
    if (!this.props.prefix || this.props.prefix.length === 0) return date;
    return `${this.props.prefix} ${date}`;
  }

  value() {
    return this.formatString(this.formatDate(this.props.date));
  }

  render() {
    if (!this.props.date) return null;
    return (
      <span>
        {this.value()}
      </span>
    );
  }
}
