import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconSpeechBubble extends Component {
  static displayName = "Icon.SpeechBubble";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 24,
    fill: "currentColor"
  };

  render() {
    const { iconClass, size, fill, stroke } = this.props;
    const classes = classnames("manicon-svg", iconClass);

    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M7.99999998,16 L3.99999997,16 L3.99999997,4.99999997 L20,4.99999997 L20,16 L14.1773533,16 L7.99999998,21.0495005 L7.99999998,16 Z M19,5.99999998 L4.99999997,5.99999998 L4.99999997,15 L8.99999999,15 L8.99999999,18.9404996 L13.8206467,15 L19,15 L19,5.99999998 Z" />
      </svg>
    );
  }
}
