import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class AnnotationGroupAlt extends Component {
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
      viewBox: this.viewBox
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <g fill="none" fillRule="evenodd">
          <path
            fill={this.fill}
            d="M3,3 L18,3 L18,14 L13.177,14 L7,19.05 L7,14 L3,14 L3,3 Z M4,4 L4,13 L8,13 L8,16.94 L12.821,13 L17,13 L17,4 L4,4 Z M20,16.0001 L13.928,16.0001 L8.567,20.3821 L7.934,19.6081 L13.571,15.0001 L19,15.0001 L19,6.0001 L20,6.0001 L20,16.0001 Z M21,8.0004 L22,8.0004 L22,18.0004 L14.928,18.0004 L10.205,21.8594 L9.573,21.0864 L14.571,17.0004 L21,17.0004 L21,8.0004 Z"
          />
        </g>
      </svg>
    );
  }
}
