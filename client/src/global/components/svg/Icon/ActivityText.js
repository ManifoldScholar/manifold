import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconActivityText extends Component {
  static displayName = "Icon.ActivityText";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 64,
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
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <path
          d="M63 32A31 31 0 1 1 32 1a31 31 0 0 1 31 31m-40.437 7.002h12v-2h-12zm0-4h15v-2h-15zm0-4h12v-2h-12zm0-4h15v-2h-15zm20 24a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6zm-23-4v-33h15.861c.042 0 .087.058.114.138l-.132.121.157.171v7.57h6.861c.057 0 .14.086.14.222v14.778a7.966 7.966 0 0 0-7.737 10zm18-30.392l3.114 3.392h-3.114zm7 20.656V22.224a2.262 2.262 0 0 0-.584-1.517l.033-.03-6.568-7.154a2.146 2.146 0 0 0-2.02-1.521h-17.86v37h18v-.136a7.996 7.996 0 1 0 9-11.6zm-1 3.736h-2v3h-3v2h3v3h2v-3h3v-2h-3z"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
