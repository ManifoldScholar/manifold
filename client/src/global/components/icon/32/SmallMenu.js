import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SmallMenu extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 18,
    height: 16
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 18 16"
      >
        <path
          d="M25,15.5 L25,16.5 L6.99999997,16.5 L6.99999997,15.5 L25,15.5 Z M25,8.49999998 L25,9.49999998 L6.99999997,9.49999998 L6.99999997,8.49999998 L25,8.49999998 Z M25,22.5 L25,23.5 L6.99999997,23.5 L6.99999997,22.5 L25,22.5 Z"
          transform="translate(-7 -8)"
        />
      </svg>
    );
  }
}
