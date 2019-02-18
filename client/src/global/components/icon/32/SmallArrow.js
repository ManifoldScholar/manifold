import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SmallArrow extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 18,
    height: 18
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 18 18"
      >
        <path
          d="M14.0744069,7.75197978 L14.7335931,7 L25.0005111,15.9999899 L14.7335931,24.9999798 L14.0744069,24.2480001 L23.483489,15.9999899 L14.0744069,7.75197978 Z M24.1022001,15.4999899 L24.1022001,16.4999899 L7,16.4999899 L7,15.4999899 L24.1022001,15.4999899 Z"
          transform="translate(-7 -7)"
        />
      </svg>
    );
  }
}
