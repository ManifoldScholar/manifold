import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconSocialFacebook extends Component {
  static displayName = "Icon.SocialFacebook";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 32,
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
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M18.168 30V17.228h4.287l.642-4.978h-4.93V9.072c0-1.44.4-2.423 2.468-2.423l2.635-.001V2.196A35.264 35.264 0 0 0 19.43 2c-3.8 0-6.402 2.32-6.402 6.58v3.67H8.73v4.978h4.298V30h5.14z" />
      </svg>
    );
  }
}
