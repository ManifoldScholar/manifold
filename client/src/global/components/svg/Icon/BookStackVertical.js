import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconBookStackVertical extends Component {
  static displayName = "Icon.BookStackVertical";

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
        <path d="M27.1 30c-1.1.2-1.8 1.2-1.7 2.3.2 1.1 1.2 1.8 2.3 1.7 1.1-.2 1.8-1.2 1.7-2.3-.2-1.1-1.2-1.8-2.3-1.7zm29 15.2v-8.6h-7.4v-9.1h3.9V17.2H9.2v8.6H5.3v12.4h7.4v7H4.3v1.6h55.5v-1.6h-3.7zm-8.9-26.4H51v7h-3.8v-7zm-4.4 0h2.8v7h-2.8v-7zm-22.2 0h20.6v7H20.6v-7zm-4.4 0H19v7h-2.8v-7zm-5.3 0h3.8v7h-3.8v-7zm-4 17.8v-9.1H47v9.1H6.9zm10.6 8.6h-3.1v-7h3.1v7zm32.2 0H19.1v-7h30.6v7zm4.8 0h-3.1v-7h3.1v7z" />
      </svg>
    );
  }
}
