import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Close extends Component {
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
          d="M7.00007316,7.70847994 L7.70712678,7.00132 L24.9999268,24.2915201 L24.2928732,24.99868 L7.00007316,7.70847994 Z M7.70712678,24.99868 L7.00007316,24.2915201 L24.2928732,7.00132 L24.9999268,7.70847994 L7.70712678,24.99868 Z"
          transform="translate(-7 -7)"
        />
      </svg>
    );
  }
}
