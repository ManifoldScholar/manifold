import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconBookStackIsometric extends Component {
  static displayName = "Icon.BookStackIsometric";

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
        <path d="M35.642 8.403H14.07a1 1 0 0 0-1 1V37.69a1 1 0 0 0 1 1h21.572V8.403zM11.07 37.69V9.403a3 3 0 0 1 3-3h23.572V40.69H14.07a3 3 0 0 1-3-3zm2-.666h-2a2.89 2.89 0 0 1 2.89-2.89h22.682v2H13.96a.89.89 0 0 0-.89.89zm30.216-20.166H36.46v-2h8.827v34.286H21.714a3 3 0 0 1-3-3v-6.454h2v6.454a1 1 0 0 0 1 1h21.572V16.857zm-22.572 28.62h-2a2.89 2.89 0 0 1 2.89-2.89h22.682v2H21.604a.89.89 0 0 0-.89.89zm23.39-20.166v-2h8.826v34.286H29.358a3 3 0 0 1-3-3v-6.454h2v6.454a1 1 0 0 0 1 1H50.93V25.31h-6.827zM28.357 53.93h-2a2.89 2.89 0 0 1 2.89-2.89H51.93v2H29.248a.89.89 0 0 0-.89.89z" />
      </svg>
    );
  }
}
