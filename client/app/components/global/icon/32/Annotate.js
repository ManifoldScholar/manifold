import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Annotate extends Component {
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
        <path d="M25.082904,11.08319 L20.9631945,6.97713321 L8.68138527,19.1624329 L6.97462644,24.9625129 L12.8041307,23.2654775 L25.082904,11.08319 Z M5.4993735,26.4334872 L7.79461468,18.6335671 L20.9648055,5.56686673 L26.5010961,11.08481 L13.3278693,24.1545225 L5.4993735,26.4334872 Z M13.418666,23.3556603 L12.7127339,24.0639398 L7.88503392,19.2522398 L8.59096603,18.5439603 L13.418666,23.3556603 Z" />
      </svg>
    );
  }
}
