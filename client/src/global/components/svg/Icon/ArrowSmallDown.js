import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconArrowSmall extends Component {
  static displayName = "Icon.ArrowSmall";

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
        transform="rotate(90)"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <path d="M37.91 32.755H22.957v-1.512h14.948l-7.917-7.14 1.032-1.146L41.044 32 31.04 41.044l-1.03-1.146 7.897-7.144z" />
      </svg>
    );
  }
}
