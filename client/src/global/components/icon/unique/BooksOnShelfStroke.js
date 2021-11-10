import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconBooksOnShelfStroke extends Component {
  static displayName = "Icon.BooksOnShelfStroke";

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    stroke: "currentColor"
  };

  render() {
    const { className, size, fill, stroke } = this.props;
    const classes = classnames("manicon-svg", className);

    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 60 60"
        aria-hidden="true"
      >
        <path
          fill="none"
          strokeLinecap="square"
          d="M45.9 28.4c.2 1.2-.6 2.3-1.8 2.5-1.2.2-2.3-.6-2.5-1.8-.2-1.2.6-2.3 1.8-2.5 1.2-.1 2.3.7 2.5 1.8zm-39 19.9H17V12.2H6.9v36.1zm44.8-2.9l-10.1 1.4-5.8-34.7 10.1-1.4 5.8 34.7zM17 43.9H6.9M17 16.5H6.9m14.4 31.8h10.1V12.2H21.3v36.1zm10.1-4.4H21.3m10.1-4.3H21.3m10.1-23.1H21.3m10.1 4.3H21.3M4 48.3h52"
        />
      </svg>
    );
  }
}
