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
    width: 12,
    height: 12
  };

  render() {
    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="0 0 12 12"
      >
        <path
          d="M2.00050275,2.70620953 L2.70769718,1.9991904 L13.9994973,13.2937905 L13.2923028,14.0008096 L2.00050275,2.70620953 Z M2.70769718,14.0008096 L2.00050275,13.2937905 L13.2923028,1.9991904 L13.9994973,2.70620953 L2.70769718,14.0008096 Z"
          transform="translate(-2 -2)"
        />
      </svg>
    );
  }
}
