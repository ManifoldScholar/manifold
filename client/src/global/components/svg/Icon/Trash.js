import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconTrash extends Component {
  static displayName = "Icon.Trash";

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
        <path d="M22.5 10.96l1 .051-.699 13.68a1.758 1.758 0 0 1-1.727 1.795h-10.16c-.968-.022-1.736-.825-1.715-1.758l-.698-13.717.998-.05.7 13.753a.754.754 0 0 0 .727.772h10.137c.417-.01.747-.355.739-.809L22.5 10.96zM6 11.427v-1h20v1H6zm6.75-.5h-1V6.82a1.276 1.276 0 0 1 1.251-1.306h6.011a1.27 1.27 0 0 1 1.238 1.293v4.12h-1V6.794a.27.27 0 0 0-.251-.28h-5.984a.276.276 0 0 0-.265.293v4.12zm.75 3.795h1v7.528h-1v-7.528zm4 0h1v7.528h-1v-7.528z"/>
      </svg>
    );
  }
}
