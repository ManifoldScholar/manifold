import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ArrowLongLeft extends Component {
  static defaultProps = {
    iconClass: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  get classes() {
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
  }

  get defaultHeight() {
    return 16;
  }

  get defaultWidth() {
    return 24;
  }

  get fill() {
    return this.props.fill;
  }

  get height() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultHeight;
    return this.size;
  }

  get size() {
    return this.props.size;
  }

  get stroke() {
    return this.props.stroke;
  }

  get viewBox() {
    return "0 0 24 16";
  }

  get width() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultWidth;
    return this.size;
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
          d="M19.9210555,8.50098377 L2,8.50098377 L2,7.49848233 L19.9183709,7.49848233 L14.6653905,2.76142495 L15.3486096,2 L22.0012062,7.99920999 L15.3651285,14 L14.6808716,13.2395122 L19.9210555,8.50098377 Z"
          transform="rotate(180 12 8)"
        />
      </svg>
    );
  }
}
