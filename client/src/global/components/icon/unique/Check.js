import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconCheck extends Component {
  static displayName = "Icon.Check";

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
        <polygon points="14.314 23.462 7.317 16.909 8.684 15.449 14.118 20.538 23.225 9.368 24.775 10.632 14.314 23.462" />
      </svg>
    );
  }
}
