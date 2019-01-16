import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconActivityResource extends Component {
  static displayName = "Icon.ActivityResource";

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
          d="M63 32A31 31 0 1 1 32 1a31 31 0 0 1 31 31M33.019 11.008l-2-.006-.02 7 2 .006zm-7.481 8.206l-3.235-6.01-1.762.948 3.235 6.009zm-5.568 5.174l-5.477-3.645-1.107 1.665 5.477 3.644zm30.656-2.708l-1.172-1.621-5.334 3.856 1.172 1.62zm-7.464-7.97l-1.797-.88-3.005 6.132 1.797.88zM32.99 51.332V38.603L44 32.7v12.702zM20 32.701l10.99 5.901V51.33L20 45.402zm22.854-1.657L31.99 36.87l-10.847-5.826 10.847-5.9zM18 30.477v16.12l13.99 7.544L46 46.597v-16.12l-14.01-7.61z"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
