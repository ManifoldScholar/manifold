import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconManifoldLogo extends Component {
  static displayName = "Icon.ManifoldLogo";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 32,
    fill: "#52e3ac"
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
        <polygon points="29.995 10.305 27.851 10.983 24.581 9.72 29.995 8.007 29.995 6.182 21.983 8.718 18.712 7.454 29.995 3.884 29.995 2.059 16.114 6.45 2 1 2.036 12.73 15.131 8.587 15.131 10.886 2.036 15.029 2.036 16.854 15.131 12.71 15.131 15.009 2.036 19.152 2.036 20.977 15.131 16.834 15.131 19.132 2.036 23.275 2.036 25.1 15.131 20.958 15.131 23.256 2.036 27.399 2.036 29.224 15.989 24.809 30 30.22" />
      </svg>
    );
  }
}
