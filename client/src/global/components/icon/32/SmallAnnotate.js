import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SmallAnnotate extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 22,
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
        viewBox="0 0 22 22"
      >
        <path
          d="M25.082904,11.08319 L20.9631945,6.97713321 L8.68138527,19.1624329 L6.97462644,24.9625129 L12.8041307,23.2654775 L25.082904,11.08319 Z M5.4993735,26.4334872 L7.79461468,18.6335671 L20.9648055,5.56686673 L26.5010961,11.08481 L13.3278693,24.1545225 L5.4993735,26.4334872 Z M13.418666,23.3556603 L12.7127339,24.0639398 L7.88503392,19.2522398 L8.59096603,18.5439603 L13.418666,23.3556603 Z"
          transform="translate(-5 -5)"
        />
      </svg>
    );
  }
}
