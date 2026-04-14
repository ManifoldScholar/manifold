import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class StopSign extends Component {
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
    return 64;
  }

  get defaultWidth() {
    return 64;
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
    return "0 0 64 64";
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
        <path d="M42.7692,5.97639996 L21.23,5.97639996 L5.99999996,21.2068 L5.99999996,42.746 L21.23,57.976 L42.7692,57.976 L58,42.746 L58,21.2068 L42.7692,5.97639996 Z M32,45 C30.3431457,45 29,43.6568543 29,42 C29,40.3431458 30.3431457,39 32,39 C33.6568543,39 35,40.3431458 35,42 C35,43.6568543 33.6568543,45 32,45 Z M32.9963,35.0011 L31.0025,35.0011 L28.0178,19 L36.0114,19 L32.9963,35.0011 Z" />
      </svg>
    );
  }
}
