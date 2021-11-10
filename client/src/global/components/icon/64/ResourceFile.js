import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ResourceFile extends Component {
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
        <path d="M5.97399996,24.9198954 L5.97399996,39.0801046 L32,57.5908636 L58.026,39.0801046 L58.026,24.9198954 L32,6.40913638 L5.97399996,24.9198954 Z M32,3.95486353 L60.026,23.8881046 L60.026,40.1118954 L32,60.0451365 L3.97399996,40.1118954 L3.97399996,23.8881046 L32,3.95486353 Z M32,21.6011364 L5.55359406,40.4109053 L4.39440586,38.7810947 L32,19.1468636 L59.6055941,38.7810947 L58.4464059,40.4109053 L32,21.6011364 Z M58.4464059,23.5890947 L59.6055941,25.2189053 L32,44.8531364 L4.39440586,25.2189053 L5.55359406,23.5890947 L32,42.3988636 L58.4464059,23.5890947 Z M33,58.8185 L31,58.8185 L31,43.6265 L33,43.6265 L33,58.8185 Z M33,20.3735 L31,20.3735 L31,5.18149996 L33,5.18149996 L33,20.3735 Z" />
      </svg>
    );
  }
}
