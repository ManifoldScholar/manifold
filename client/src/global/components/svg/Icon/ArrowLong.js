import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconArrowLong extends Component {
  static displayName = "Icon.ArrowLong";

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
        height={size * 0.75}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 24 16"
        aria-hidden="true"
      >
        <path
          d="M19.921 8.501H2V7.498h17.918l-5.253-4.737L15.35 2 22 8l-6.636 6-.684-.76z"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
