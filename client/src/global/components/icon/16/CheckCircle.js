import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class CheckCircle extends Component {
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
    return 18;
  }

  get defaultWidth() {
    return 18;
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
    return "0 0 18 18";
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps} data-check-indicator>
        <rect
          x="0.5"
          y="0.5"
          width="17"
          height="17"
          rx="8.5"
          fill="currentColor"
        />
        <rect
          x="0.5"
          y="0.5"
          width="17"
          height="17"
          rx="8.5"
          stroke="currentColor"
        />
        <path data-check-path d="M4 9L8 12.5L14 5.5" strokeWidth="1.5" />
      </svg>
    );
  }
}
