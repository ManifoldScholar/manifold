import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CirclePlus extends Component {
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
          d="M9.99999998,16.5 L9.99999998,15.5 L22,15.5 L22,16.5 L9.99999998,16.5 Z M16.5,22 L15.5,22 L15.5,9.99999998 L16.5,9.99999998 L16.5,22 Z M16,27 C9.92486773,27 4.99999997,22.0751323 4.99999997,16 C4.99999997,9.92486773 9.92486773,4.99999997 16,4.99999997 C22.0751323,4.99999997 27,9.92486773 27,16 C27,22.0751323 22.0751323,27 16,27 Z M16,26 C21.5228475,26 26,21.5228475 26,16 C26,10.4771525 21.5228475,5.99999997 16,5.99999997 C10.4771525,5.99999997 5.99999997,10.4771525 5.99999997,16 C5.99999997,21.5228475 10.4771525,26 16,26 Z"
          transform="translate(-5 -5)"
        />
      </svg>
    );
  }
}
