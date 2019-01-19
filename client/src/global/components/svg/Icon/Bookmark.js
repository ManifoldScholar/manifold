import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconBookmark extends Component {
  static displayName = "Icon.Bookmark";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 24,
    fill: "currentColor"
  };

  render() {
    const { iconClass, size, fill, stroke } = this.props;
    const classes = classnames("manicon-svg", iconClass);

    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17,19.1970251 L17,4.96799997 L6.99999998,4.96799997 L6.99999998,19.1970251 L12,15.9688432 L17,19.1970251 Z M5.99999997,21.032975 L5.99999997,3.96799997 L18,3.96799997 L18,21.032975 L12,17.1591568 L5.99999997,21.032975 Z" />
      </svg>
    );
  }
}
