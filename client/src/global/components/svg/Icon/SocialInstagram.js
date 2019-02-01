import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconSocialInstagram extends Component {
  static displayName = "Icon.SocialInstagram";

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
        <path d="M28.922 10.64a9.542 9.542 0 0 0-.605-3.156 6.647 6.647 0 0 0-3.802-3.802 9.54 9.54 0 0 0-3.155-.604C19.973 3.015 19.53 3 16 3c-3.53 0-3.973.015-5.36.078a9.54 9.54 0 0 0-3.156.604 6.647 6.647 0 0 0-3.802 3.802 9.542 9.542 0 0 0-.604 3.156C3.015 12.027 3 12.47 3 16c0 3.53.015 3.973.078 5.36a9.542 9.542 0 0 0 .604 3.156 6.647 6.647 0 0 0 3.802 3.802 9.542 9.542 0 0 0 3.156.604c1.387.063 1.83.078 5.36.078 3.53 0 3.973-.015 5.36-.078a9.542 9.542 0 0 0 3.156-.605 6.647 6.647 0 0 0 3.802-3.802 9.542 9.542 0 0 0 .604-3.155c.063-1.387.078-1.83.078-5.36 0-3.53-.015-3.973-.078-5.36zm-2.34 10.613a7.191 7.191 0 0 1-.448 2.414 4.305 4.305 0 0 1-2.467 2.467 7.2 7.2 0 0 1-2.414.448c-1.37.062-1.782.075-5.253.075s-3.883-.013-5.253-.075a7.2 7.2 0 0 1-2.414-.448 4.305 4.305 0 0 1-2.467-2.467 7.191 7.191 0 0 1-.448-2.414c-.062-1.37-.076-1.782-.076-5.253s.014-3.882.076-5.253a7.19 7.19 0 0 1 .448-2.414 4.305 4.305 0 0 1 2.467-2.467 7.191 7.191 0 0 1 2.414-.448c1.37-.062 1.782-.076 5.253-.076s3.882.014 5.253.076c.824.01 1.641.161 2.414.448a4.305 4.305 0 0 1 2.467 2.467 7.19 7.19 0 0 1 .448 2.414c.062 1.37.076 1.782.076 5.253s-.014 3.882-.076 5.253zM16 9.324a6.676 6.676 0 1 0 0 13.352 6.676 6.676 0 0 0 0-13.352zm0 11.01a4.333 4.333 0 1 1 0-8.667 4.333 4.333 0 0 1 0 8.666zm6.94-9.713a1.56 1.56 0 1 0 0-3.12 1.56 1.56 0 0 0 0 3.12z" />
      </svg>
    );
  }
}
