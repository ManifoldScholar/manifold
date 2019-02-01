import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconArrow extends Component {
  static displayName = "Icon.Arrow";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 16,
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
        transform="rotate(90)"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M11.921 8.501H2V7.498h9.918L6.665 2.761 7.35 2 14 8l-6.636 6-.684-.76L11.92 8.5z" />
      </svg>
    );
  }
}
