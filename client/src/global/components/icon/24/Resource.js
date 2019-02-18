import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Resource extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 16,
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
        viewBox="0 0 16 18"
      >
        <path
          d="M20,7.21504954 L20,16.7580616 L12,20.9927283 L3.99999997,16.7580616 L3.99999997,7.21504954 L12,3.00704952 L20,7.21504954 Z M19,7.81895042 L12,4.13695041 L4.99999997,7.81895042 L4.99999997,16.1559384 L12,19.8612718 L19,16.1559384 L19,7.81895042 Z M12.5,20.4009 L11.5,20.4009 L11.5,11.4612 L12.5,11.4612 L12.5,20.4009 Z M19.2660832,7.04909169 L19.7339168,7.93290827 L12,12.0267282 L4.26608318,7.93290827 L4.73391676,7.04909169 L12,10.8952718 L19.2660832,7.04909169 Z"
          transform="translate(-4 -3)"
        />
      </svg>
    );
  }
}
