import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class BEProject extends Component {
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
        <path
          fillRule="evenodd"
          d="M9.103,24.948 L32.045,34.722 L54.984,24.948 L32.045,15.174 L9.103,24.948 Z M32.045,36.896 L4,24.948 L32.045,13 L60.086,24.948 L32.045,36.896 Z M60.009,32.175 L60.009,30 L32.01,41.94 L4,30.021 L4,32.194 L32.011,44.113 L60.009,32.175 Z M60.009,39.175 L60.009,37 L32.01,48.94 L4,37.02 L4,39.194 L32.011,51.113 L60.009,39.175 Z"
        />
      </svg>
    );
  }
}
