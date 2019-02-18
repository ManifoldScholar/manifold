import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Arrow extends Component {
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
          d="M19.483489,12 L10.0744069,3.75198985 L10.7335931,3.00001007 L21.0005111,12 L10.7335931,20.9999899 L10.0744069,20.2480101 L19.483489,12 Z M20.2415,11.5 L20.2415,12.5 L2.99999996,12.5 L2.99999996,11.5 L20.2415,11.5 Z"
          transform="translate(-3 -3)"
        />
      </svg>
    );
  }
}
