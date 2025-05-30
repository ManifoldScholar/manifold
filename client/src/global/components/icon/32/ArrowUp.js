import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ArrowUp extends Component {
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
        <path
          d="M14.0744069,7.75197978 L14.7335931,7 L25.0005111,15.9999899 L14.7335931,24.9999798 L14.0744069,24.2480001 L23.483489,15.9999899 L14.0744069,7.75197978 Z M24.1022001,15.4999899 L24.1022001,16.4999899 L7,16.4999899 L7,15.4999899 L24.1022001,15.4999899 Z"
          transform="rotate(-90 16 16)"
        />
      </svg>
    );
  }
}
