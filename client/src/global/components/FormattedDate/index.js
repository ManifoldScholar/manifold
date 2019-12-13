import React, { Component } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import formatDistance from "date-fns/formatDistance";
import isDate from "lodash/isDate";

export default class FormattedDate extends Component {
  static displayName = "FormattedDate";

  static propTypes = {
    prefix: PropTypes.string,
    format: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  };

  get date() {
    const { date } = this.props;
    if (isDate(date)) return date;
    return parseISO(date);
  }

  get value() {
    return this.formatString(this.formatDate(this.date));
  }

  get dateTime() {
    return format(this.date, "yyyy-MM-dd");
  }

  formatDate(date) {
    if (!date) return;
    if (this.props.format === "distanceInWords")
      return formatDistance(this.date, Date.now());
    const outFormat = this.props.format ? this.props.format : "MMMM dd, yyyy";
    return format(this.date, outFormat);
  }

  formatString(date) {
    if (!this.props.prefix || this.props.prefix.length === 0) return date;
    return `${this.props.prefix} ${date}`;
  }

  render() {
    if (!this.props.date) return null;
    return <time dateTime={this.dateTime}>{this.value}</time>;
  }
}
