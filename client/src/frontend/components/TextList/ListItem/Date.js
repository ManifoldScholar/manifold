import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";

export default class TextListListItemDate extends Component {
  static displayName = "TextList.ListItem.Date";

  static propTypes = {
    baseClass: PropTypes.string,
    date: PropTypes.string.isRequired,
    datePrefix: PropTypes.string,
    inline: PropTypes.bool
  };

  render() {
    return (
      <span
        className={classNames(`${this.props.baseClass}__date`, {
          [`${this.props.baseClass}__date--inline`]: this.props.inline,
          [`${this.props.baseClass}__date--block`]: !this.props.inline
        })}
      >
        <FormattedDate
          prefix={this.props.datePrefix}
          format="MMMM YYYY"
          date={this.props.date}
        />
      </span>
    );
  }
}
