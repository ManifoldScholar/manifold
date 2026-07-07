import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Link extends Component {
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
    return 16;
  }

  get defaultWidth() {
    return 16;
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
    return "0 0 16 16";
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
          fill="currentColor"
          fillRule="evenodd"
          stroke="currentColor"
          strokeWidth={0.25}
          d="M4.207 11.961a2.5 2.5 0 0 1 0-3.535L5.622 7.01l-.708-.707L3.5 7.718a3.5 3.5 0 1 0 4.95 4.95l1.414-1.414-.707-.707-1.414 1.414a2.5 2.5 0 0 1-3.536 0Zm5.304-6.01L5.975 9.486l.707.707 3.536-3.535-.707-.707Zm-2.475-.354L8.45 4.183a2.5 2.5 0 1 1 3.536 3.535L10.57 9.133l.707.707 1.415-1.414a3.5 3.5 0 0 0-4.95-4.95L6.329 4.89l.707.707Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
}
