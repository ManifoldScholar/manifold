import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconActivityTweet extends Component {
  static displayName = "Icon.ActivityTweet";

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
          d="M44.577 26.983c.012.273.019.546.019.822 0 8.407-6.394 18.102-18.091 18.102a18.067 18.067 0 0 1-9.754-2.864 12.865 12.865 0 0 0 9.416-2.634 6.369 6.369 0 0 1-5.943-4.42 6.041 6.041 0 0 0 1.196.115 6.45 6.45 0 0 0 1.676-.22A6.362 6.362 0 0 1 18 29.646v-.082a6.242 6.242 0 0 0 2.876.797 6.355 6.355 0 0 1-1.966-8.489 18.02 18.02 0 0 0 13.106 6.64 6.287 6.287 0 0 1-.161-1.279 6.364 6.364 0 0 1 11-4.52 12.583 12.583 0 0 0 4.039-1.538 6.382 6.382 0 0 1-2.796 3.514 12.527 12.527 0 0 0 3.653-1.002 12.804 12.804 0 0 1-3.174 3.296M32 1a31 31 0 1 0 31 31A31 31 0 0 0 32 1"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
