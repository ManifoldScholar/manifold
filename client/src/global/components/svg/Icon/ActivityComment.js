import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconActivityComment extends Component {
  static displayName = "Icon.ActivityComment";

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
          d="M63 32A31 31 0 1 1 32 1a31 31 0 0 1 31 31M46 43.002h-3.927l-.468-2.902a4.79 4.79 0 0 0-4.702-4.098h-9.816a4.788 4.788 0 0 0-4.702 4.098l-.468 2.902H18v-24h28zm-8.921 0L29 50.061v-7.059h-5.057l.416-2.585a2.798 2.798 0 0 1 2.728-2.415h9.816a2.8 2.8 0 0 1 2.728 2.416l.416 2.584zM16 17.002v28h11v9.461l10.829-9.461H48v-28zm16 7a4 4 0 1 1-4 4 4.004 4.004 0 0 1 4-4m0 10a6 6 0 1 0-6-6 6.006 6.006 0 0 0 6 6"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
