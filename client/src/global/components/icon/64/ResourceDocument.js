import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ResourceDocument extends Component {
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
        <path d="M51,58 L51,17.8331 C51,17.6121481 50.9122272,17.4002459 50.7559907,17.2440093 C50.5997541,17.0877728 50.3878519,17 50.1669,17 L40,17 L40,6.83309996 C40,6.37299153 39.6270084,5.99999996 39.1669,5.99999996 L13,5.99999996 L13,58 L51,58 Z M42,15 L50.1669,15 C50.9182849,15 51.6388949,15.2984864 52.1702043,15.8297958 C52.7015136,16.3611051 53,17.0817151 53,17.8331 L53,60 L11,60 L11,3.99999996 L39.1669,3.99999996 C40.7315779,3.99999996 42,5.26842203 42,6.83309996 L42,15 Z M39.6862229,6.18893547 L41.0987771,4.77306445 L52.1547771,15.8031645 L50.7422229,17.2190355 L39.6862229,6.18893547 Z M20.0004958,24.9999999 L19.9995041,23.0000001 L43.9995042,22.9881001 L44.0004959,24.9880999 L20.0004958,24.9999999 Z M20.0004958,34.9999999 L19.9995041,33.0000001 L43.9995042,32.9881001 L44.0004959,34.9880999 L20.0004958,34.9999999 Z M20.0004958,44.9999999 L19.9995041,43.0000001 L43.9995042,42.9881001 L44.0004959,44.9880999 L20.0004958,44.9999999 Z M20,30 L20,28 L39,28 L39,30 L20,30 Z M20,40 L20,38 L39,38 L39,40 L20,40 Z" />
      </svg>
    );
  }
}
