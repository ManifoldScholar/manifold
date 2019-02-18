import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SocialCite extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: 26,
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
        viewBox="0 0 26 20"
      >
        <path
          d="M2.99999996,14.59 C2.99999996,22.1751 7.33859997,26 14,26 L14,21.9918 C11.9188,21.9918 9.12559998,21.7804 9.12559998,17.2936 L14,17.2936 L14,5.99999997 L2.99999996,5.99999997 L2.99999996,14.59 Z M29,5.99999997 L18,5.99999997 L18,14.59 C18,22.1751 22.3386,26 29,26 L29,21.9918 C26.9188,21.9918 24.1256,21.7804 24.1256,17.2936 L29,17.2936 L29,5.99999997 Z"
          transform="translate(-3 -6)"
        />
      </svg>
    );
  }
}
