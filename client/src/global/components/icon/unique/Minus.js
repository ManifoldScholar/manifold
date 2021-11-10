import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconMinus extends Component {
  static displayName = "Icon.Minus";

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 32,
    fill: "currentColor"
  };

  render() {
    const { className, size, fill, stroke } = this.props;
    const classes = classnames("manicon-svg", className);

    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <rect x="9" y="15" width="14" height="2" />
      </svg>
    );
  }
}
