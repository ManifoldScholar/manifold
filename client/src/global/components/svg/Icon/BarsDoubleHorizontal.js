import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconBarsDoubleHorizontal extends Component {
  static displayName = "Icon.BarsDoubleHorizontal";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 32,
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
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M25,11.5 L25,12.5 L6.99999997,12.5 L6.99999997,11.5 L25,11.5 Z M25,19.5 L25,20.5 L6.99999997,20.5 L6.99999997,19.5 L25,19.5 Z" />
      </svg>
    );
  }
}
