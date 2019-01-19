import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconActivityEgg extends Component {
  static displayName = "Icon.ActivityEgg";

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
          d="M63 32A31 31 0 1 1 32 1a31 31 0 0 1 31 31M7 33.002h7v-2H7zm8.322-7.947l-6.627-2.254-.644 1.893 6.626 2.255zM8.064 39.324l.645 1.893 6.626-2.255-.644-1.893zM50 33.002h7v-2h-7zm5.95-8.309l-.646-1.893-6.626 2.255.644 1.893zm-7.285 14.268l6.626 2.255.645-1.893-6.626-2.255zm-8.533 4.594A10.057 10.057 0 0 1 32 47a10.056 10.056 0 0 1-8.132-3.445c-2.462-2.945-3.383-7.763-2.462-12.887 1.207-6.718 5.5-13.667 10.594-13.667 5.095 0 9.387 6.949 10.594 13.667a21.32 21.32 0 0 1 .317 4.55l-4.452-4.453-4.465 4.466-3.814-4.45-4.632 3.86 1.28 1.536 3.117-2.598 3.936 4.592 4.578-4.577 4.193 4.192a12.42 12.42 0 0 1-2.52 5.767M32 15.001c-6.372 0-11.23 7.89-12.563 15.314-1.04 5.785.017 11.08 2.897 14.522A12.117 12.117 0 0 0 32 49.002a12.116 12.116 0 0 0 9.666-4.163c2.88-3.445 3.936-8.738 2.897-14.523-1.334-7.424-6.19-15.314-12.563-15.314"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
