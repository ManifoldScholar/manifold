import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class CircleMinus extends Component {
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
        <path d="M8,13 L8,12 L17,12 L17,13 L8,13 Z M20,12.5 C20,8.35814237 16.6418576,5 12.5,5 C8.3574974,5 5,8.35778732 5,12.5 C5,16.6422127 8.3574974,20 12.5,20 C16.6418576,20 20,16.6418576 20,12.5 Z M21,12.5 C21,17.1941424 17.1941424,21 12.5,21 C7.80519332,21 4,17.1944781 4,12.5 C4,7.8055219 7.80519332,4 12.5,4 C17.1941424,4 21,7.80585763 21,12.5 Z" />
      </svg>
    );
  }
}
