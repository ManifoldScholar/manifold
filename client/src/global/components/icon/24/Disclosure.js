import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Disclosure extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 18,
    height: 8
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 18 8"
      >
        <polygon
          points="20.374 9 21 9.78 12 17 3 9.78 3.626 9 12 15.718"
          transform="translate(-3 -9)"
        />
      </svg>
    );
  }
}
