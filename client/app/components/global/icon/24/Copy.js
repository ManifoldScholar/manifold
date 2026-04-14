import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Copy extends Component {
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
    return 24;
  }

  get defaultWidth() {
    return 24;
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
    return "0 0 24 24";
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
        <path d="M4.99999997,3.99999997 L4.99999997,18 L3.99999997,18 L3.99999997,2.99999996 L18,2.99999996 L18,3.99999997 L4.99999997,3.99999997 Z M7.99999998,6.99999998 L7.99999998,20 L19,20 L19,6.99999998 L7.99999998,6.99999998 Z M20,5.99999997 L20,21 L6.99999998,21 L6.99999998,5.99999997 L20,5.99999997 Z M9.99999999,11 L9.99999999,9.99999999 L17,9.99999999 L17,11 L9.99999999,11 Z M9.99999999,14 L9.99999999,13 L17,13 L17,14 L9.99999999,14 Z M9.99999999,17 L9.99999999,16 L17,16 L17,17 L9.99999999,17 Z" />
      </svg>
    );
  }
}
