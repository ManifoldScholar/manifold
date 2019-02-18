import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SmallBookmark extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 16,
    height: 22
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 16 22"
      >
        <path
          d="M23,6.49999997 L8.99999998,6.49999997 L8.99999998,24.7347124 L16,20.542179 L23,24.7347124 L23,6.49999997 Z M7.99999997,26.4992877 L7.99999997,5.49999997 L24,5.49999997 L24,26.4992877 L16,21.707821 L7.99999997,26.4992877 Z"
          transform="translate(-8 -5)"
        />
      </svg>
    );
  }
}
