import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ArrowUpDown extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object,
  };

  static defaultProps = {
    className: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {},
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
      fill: this.fill,
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M6.41,12.46l-.71-.7,5.02-5.06,5.02,5.06-.71.7-3.81-3.84v12.68h-1v-12.68l-3.81,3.84Z" />
        <path d="M25.59,19.54l.71.7-5.02,5.06-5.02-5.06.71-.7,3.81,3.84v-12.68h1v12.68l3.81-3.84Z" />
      </svg>
    );
  }
}
