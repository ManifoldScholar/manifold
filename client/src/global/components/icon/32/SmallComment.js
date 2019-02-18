import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SmallComment extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 20,
    height: 20
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 20 20"
      >
        <path
          d="M12.109,20.319 L5.99999997,20.319 L5.99999997,7.00999997 L26,7.00999997 L26,20.319 L18.8529849,20.319 L12.109,26.9658287 L12.109,20.319 Z M25,8.00999998 L6.99999997,8.00999998 L6.99999997,19.319 L13.109,19.319 L13.109,24.5761714 L18.4430151,19.319 L25,19.319 L25,8.00999998 Z"
          transform="translate(-6 -7)"
        />
      </svg>
    );
  }
}
