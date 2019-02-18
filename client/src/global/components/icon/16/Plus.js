import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Plus extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 13,
    height: 13
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 13 13"
      >
        <path
          d="M2.01435,8.5138 L2.014482,7.5138 L14.01435,7.5149 L14.014218,8.5149 L2.01435,8.5138 Z M8.5149,14.014218 L7.5149,14.01435 L7.5138,2.014482 L8.5138,2.01435 L8.5149,14.014218 Z"
          transform="translate(-2 -2)"
        />
      </svg>
    );
  }
}
