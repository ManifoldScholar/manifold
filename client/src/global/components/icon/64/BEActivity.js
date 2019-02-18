import React, { Component } from "react";
import PropTypes from "prop-types";

export default class BEActivity extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 58,
    height: 40
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 58 40"
      >
        <polygon
          points="22.791 18.269 15.088 36.872 3.991 36.872 3.991 34.872 13.752 34.872 22.947 12.661 34.599 45.963 44.925 23.154 49.777 34.872 60.009 34.872 60.009 36.872 48.441 36.872 44.843 28.184 34.361 51.339"
          transform="translate(-3 -12)"
        />
      </svg>
    );
  }
}
