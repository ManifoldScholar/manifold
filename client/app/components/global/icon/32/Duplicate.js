import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Duplicate extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    className: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  get defaultHeight() {
    return 32;
  }

  get defaultWidth() {
    return 32;
  }

  get size() {
    return this.props.size;
  }

  get width() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultWidth;
    return this.size;
  }

  get height() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultHeight;
    return this.size;
  }

  get viewBox() {
    return "0 0 32 32";
  }

  get classes() {
    const { className } = this.props;
    return classnames("manicon-svg", className);
  }

  get fill() {
    return this.props.fill;
  }

  get stroke() {
    return this.props.stroke;
  }

  render() {
    const baseSvgProps = {
      xmlns: "http://www.w3.org/2000/svg",
      className: this.classes,
      width: this.width,
      height: this.height,
      viewBox: this.viewBox,
      fill: this.fill
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M22.0295628,8.96340998 L22.8084372,9.59058998 L11.5891465,23.5234603 L3.63491665,16.1025984 L4.31708328,15.3714016 L11.4848535,22.0585397 L22.0295628,8.96340998 Z M8.94916889,14.4595381 L9.62103106,13.7188619 L12.9426311,16.7318619 L12.2707689,17.4725381 L8.94916889,14.4595381 Z M17.4830332,22.6180949 L16.7041668,21.9909051 L27.5863668,8.47700507 L28.3652333,9.10419489 L17.4830332,22.6180949 Z" />
      </svg>
    );
  }
}
