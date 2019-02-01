import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconGlasses extends Component {
  static displayName = "Icon.Glasses";

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
        <path d="M36.286 44.67c-4.689 0-8.48-3.889-8.48-8.674s3.791-8.675 8.48-8.675c4.69 0 8.48 3.89 8.48 8.675s-3.79 8.675-8.48 8.675zm0-2c3.573 0 6.48-2.982 6.48-6.674s-2.907-6.675-6.48-6.675c-3.573 0-6.48 2.983-6.48 6.675 0 3.692 2.907 6.675 6.48 6.675zm8.197-5.598l-1.433-1.396 10.57-10.844a4.019 4.019 0 0 1 6.88 2.925l-2-.052a2.019 2.019 0 0 0-3.452-1.473l-10.565 10.84zm-26.318-7.443l-1.437-1.39 7.449-7.695a4.019 4.019 0 0 1 6.88 2.924l-2-.052a2.019 2.019 0 0 0-3.45-1.475l-7.442 7.688zm3.692 8.031l-.794-1.835 1.637-.709a6.123 6.123 0 0 1 4.866 0l1.637.709-.794 1.835-1.638-.708a4.123 4.123 0 0 0-3.276 0l-1.638.708zm-7.877 7.01c-4.69 0-8.48-3.889-8.48-8.674s3.79-8.675 8.48-8.675 8.48 3.89 8.48 8.675-3.79 8.675-8.48 8.675zm0-2c3.573 0 6.48-2.982 6.48-6.674s-2.907-6.675-6.48-6.675c-3.573 0-6.48 2.983-6.48 6.675 0 3.692 2.907 6.675 6.48 6.675z" />
      </svg>
    );
  }
}
