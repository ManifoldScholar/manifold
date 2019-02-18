import React, { Component } from "react";
import PropTypes from "prop-types";

export default class DisclosureDown extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 18,
    height: 10
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 18 10"
      >
        <polygon
          points="24.325 12.504 25.001 13.24 16 21.496 6.999 13.24 7.675 12.504 16 20.14"
          transform="translate(-7 -12)"
        />
      </svg>
    );
  }
}
